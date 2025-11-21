import anywidget
import urllib3
from traitlets import Unicode

class CustomWidget(anywidget.AnyWidget):
    elementId = Unicode().tag(sync=True)

    def readFromWeb(url: str) -> str:
        http = urllib3.PoolManager(cert_reqs="CERT_NONE")
        response = http.request("GET", url)
        text = response.data.decode("utf-8")
        return text

    def readFromLocalFile(path: str) -> str:
        text = ""
        with open(path, "r") as file:
            lines = file.readlines()
            text = text.join(lines)
        return text

    def createWidgetFromLocalFile(paramList: list, 
                                  filePath: str, 
                                  height:int=400, 
                                  d3_version: str = "7", 
                                  extra_imports: list = []):
        """
        paramList: lista de nombres de variables (traitlets) que el JS leerá del modelo.
        filePath: ruta local del archivo JS que contiene la función plot(...)
        d3_version: versión de d3 a usar (ej: "7", "7.9.0", "v7", etc.)
        extra_imports: lista de líneas completas de import JS. Ej:
            [
              'import { feature } from "https://esm.sh/topojson-client@3";',
              'import * as h3 from "https://esm.sh/h3-js@4";'
            ]
        """
        return CustomWidget._createWidget(
            paramList, 
            filePath, 
            CustomWidget.readFromLocalFile,
            height=height,
            d3_version=d3_version,
            extra_imports=extra_imports
        )

    def createWidgetFromUrl(paramList: list, 
                            jsUrl: str, 
                            height:int=400, 
                            d3_version: str = "7", 
                            extra_imports: list = []):
        return CustomWidget._createWidget(paramList=paramList, 
                                          string=jsUrl, 
                                          fileReader=CustomWidget.readFromWeb,
                                          height=height,
                                          d3_version=d3_version,
                                          extra_imports=extra_imports)

    def _createWidget(paramList: list, string: str, fileReader,height:int=400, d3_version: str = "7", extra_imports: list = []):
        cleaned_imports = [ln.strip() for ln in extra_imports if ln and ln.strip()]
        d3_import = f'import * as d3 from "https://esm.sh/d3@{d3_version}";'
        extra_imports_block = "\n".join(cleaned_imports)
        modelVars = ""
        modelChanges = ""
        paramsString = ", ".join(paramList)
        for var in paramList:
            modelVars += f'\t\t\t\t\tconst {var} = model.get("{var}");\n'

        for var in paramList:
            modelChanges += f'\t\t\t\t\tmodel.on("change:{var}", replot);\n'

        fileStr = fileReader(string)
        jsStr = """
{d3_import}
{extra_imports_block}

function render({{ model, el }} ) {{
    let element;
    let width;
    let height;

    function getElement() {{
        const elementId = model.get("elementId");

        let element = el;
        if (elementId) {{
            element = document.getElementById(elementId);
        }}
        
        return element;
    }}

    function setSizes() {{
        const elementId = model.get("elementId");

        height = {height};
        if (elementId) {{
            element = document.getElementById(elementId);
            if (element.clientHeight) height = element.clientHeight;
            else height = null;
        }}
        if (element.clientWidth) width = element.clientWidth;
        else width = null;
    }}

    function replot() {{
        element.innerHTML = "";

{modelVars}

        plot({paramsString})
    }}

    let elapsedTime = 0;

    let intr = setInterval(() => {{
        try {{
            elapsedTime += 100;
            if (elapsedTime > 20000) {{
                throw "Widget took too long to render";
            }}
            element = getElement();
            if (!element) return;
            setSizes();
            if (element && width && height) {{
{modelChanges}

{modelVars}
                    plot({paramsString});
                    clearInterval(intr);
                }}
        }} catch (err) {{
            console.log(err.stack);
            clearInterval(intr);
        }}
    }}, 100);

    {fileStr}
}}

export default {{ render }};
        """.format(
            d3_import=d3_import,
            extra_imports_block=extra_imports_block,
            fileStr=fileStr,
            height=height,
            modelVars=modelVars,
            paramsString=paramsString,
            modelChanges=modelChanges,
        )

        with open("teste.js", "w", encoding="utf-8") as f:
            f.write(jsStr)

        return jsStr