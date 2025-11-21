import { BaseModel, BaseView } from "../base/base";
import { BaseWidget } from "../base/base_widget";
import "../../css/layout.css";

export interface MatrixParams {
    matrix: number[][],
    grid_areas: string[],
    rows?: number,
    columns?: number
}

class MatrixCreator extends BaseWidget {
    private currentGroup: number = 1;
    private isDragging: boolean = false;
    private startCell: HTMLElement | null = null;
    private readonly groupColors: string[] = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];

    constructor(element: HTMLElement) {
        super(element);
        this.setupGlobalEventListeners();
    }

    private setupGlobalEventListeners(): void {
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.startCell = null;
        });
    }

    create_node(): HTMLElement {
        const node = document.createElement("div");
        node.classList.add("matrix-creator-container");
        return node;
    }

    private createMatrixGrid(matrix: number[][]): HTMLElement {
        const matrixGrid = document.createElement("div");
        matrixGrid.className = "matrix-grid";

        for (const [rowIndex, row] of matrix.entries()) {
            const matrixRow = document.createElement("div");
            matrixRow.className = "matrix-row";

            for (const [colIndex] of row.entries()) {
                const matrixCell = document.createElement("div");
                matrixCell.className = "matrix-cell";
                matrixCell.dataset.row = rowIndex.toString();
                matrixCell.dataset.col = colIndex.toString();
                matrixCell.dataset.group = "0";

                // Event listeners para la funcionalidad de arrastrar y seleccionar
                matrixCell.addEventListener('mousedown', (e) => this.handleMouseDown(e, matrixCell));
                matrixCell.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, matrixCell));
                matrixCell.addEventListener('mouseup', (e) => this.handleMouseUp(e, matrixCell));

                matrixRow.appendChild(matrixCell);
            }

            matrixGrid.appendChild(matrixRow);
        }

        return matrixGrid;
    }

    private createControlPanel(containerElement: HTMLElement): HTMLElement {
        const controlPanel = document.createElement("div");
        controlPanel.className = "control-panel";

        // Información del grupo actual
        const groupInfo = document.createElement("div");
        groupInfo.className = "group-info";

        const groupLabel = document.createElement("span");
        groupLabel.textContent = "Grupo Actual:";
        groupLabel.className = "group-label";


        const currentGroupDisplay = document.createElement("span");
        currentGroupDisplay.id = "current-group-display";
        currentGroupDisplay.textContent = this.currentGroup.toString();
        currentGroupDisplay.className = "current-group-display";
        currentGroupDisplay.style.backgroundColor = this.groupColors[this.currentGroup - 1];

        groupInfo.appendChild(groupLabel);
        groupInfo.appendChild(currentGroupDisplay);

        // Botones de control
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";

        const nextGroupBtn = this.createButton("➡️ Siguiente Contenedor", () => {
            this.nextGroup();
            this.updateGroupDisplay(currentGroupDisplay);
        });

        const resetGroupsBtn = this.createButton("🔄 Resetear Contenedores", () => {
            this.resetGroups(containerElement);
            this.updateGroupDisplay(currentGroupDisplay);
        });

        const getMatrixBtn = this.createButton("📊 Guardar ", () => {
            this.showMatrix(containerElement);
        });

        buttonsContainer.appendChild(nextGroupBtn);
        buttonsContainer.appendChild(resetGroupsBtn);
        buttonsContainer.appendChild(getMatrixBtn);

        controlPanel.appendChild(groupInfo);
        controlPanel.appendChild(buttonsContainer);

        return controlPanel;
    }

    private createButton(text: string, onClick: () => void): HTMLElement {
        const button = document.createElement("button");
        button.textContent = text;
        button.className = "matrix-button";
        button.addEventListener('click', onClick);
        return button;
    }

    private handleMouseDown(e: MouseEvent, cell: HTMLElement): void {
        e.preventDefault();
        this.isDragging = true;
        this.startCell = cell;
        this.clearTemporarySelection();
        cell.classList.add('selecting');
        cell.style.background = 'rgba(102, 126, 234, 0.3)';
    }

    private handleMouseEnter(e: MouseEvent, cell: HTMLElement): void {
        if (!this.isDragging || !this.startCell) return;

        this.clearTemporarySelection();

        const startRow = Number.parseInt(this.startCell.dataset.row!);
        const startCol = Number.parseInt(this.startCell.dataset.col!);
        const endRow = Number.parseInt(cell.dataset.row!);
        const endCol = Number.parseInt(cell.dataset.col!);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const allCells = cell.closest('.matrix-grid')?.querySelectorAll('.matrix-cell');
        if (allCells) {
            for (const c of Array.from(allCells)) {
                const cellElement = c as HTMLElement;
                const cellRow = Number.parseInt(cellElement.dataset.row!);
                const cellCol = Number.parseInt(cellElement.dataset.col!);

                if (cellRow >= minRow && cellRow <= maxRow && cellCol >= minCol && cellCol <= maxCol) {
                    cellElement.classList.add('selecting');
                    cellElement.style.background = 'rgba(102, 126, 234, 0.3)';
                }
            }
        }
    }

    private handleMouseUp(e: MouseEvent, cell: HTMLElement): void {
        if (!this.isDragging || !this.startCell) return;

        const startRow = Number.parseInt(this.startCell.dataset.row!);
        const startCol = Number.parseInt(this.startCell.dataset.col!);
        const endRow = Number.parseInt(cell.dataset.row!);
        const endCol = Number.parseInt(cell.dataset.col!);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const allCells = cell.closest('.matrix-grid')?.querySelectorAll('.matrix-cell');

        if (allCells) {
            for (const c of Array.from(allCells)) {
                const cellElement = c as HTMLElement;
                const cellRow = Number.parseInt(cellElement.dataset.row!);
                const cellCol = Number.parseInt(cellElement.dataset.col!);

                if (cellRow >= minRow && cellRow <= maxRow && cellCol >= minCol && cellCol <= maxCol) {
                    cellElement.dataset.group = this.currentGroup.toString();
                    cellElement.style.backgroundColor = this.groupColors[this.currentGroup - 1];
                    cellElement.style.color = '#fff';
                    cellElement.style.fontWeight = 'bold';
                    cellElement.classList.remove('selecting');
                }
            }
        }

        this.isDragging = false;
        this.startCell = null;
    }

    private clearTemporarySelection(): void {
        const selectingCells = document.querySelectorAll('.matrix-cell.selecting');
        for (const cell of Array.from(selectingCells)) {
            const cellElement = cell as HTMLElement;
            cellElement.classList.remove('selecting');
            const group = cellElement.dataset.group;
            if (group === '0') {
                cellElement.style.background = '#fff';
            }
        }
    }

    private nextGroup(): void {
        // Verificar si el grupo actual tiene celdas asignadas
        if (!this.hasGroupCells(this.currentGroup)) {

            return;
        }

        this.currentGroup++;
        if (this.currentGroup > 9) {
            this.currentGroup = 1;
        }
    }

    private hasGroupCells(groupNumber: number): boolean {
        // Buscar si existen celdas con el grupo actual asignado
        const cells = document.querySelectorAll('.matrix-cell');
        for (const cell of Array.from(cells)) {
            const cellElement = cell as HTMLElement;
            const cellGroup = Number.parseInt(cellElement.dataset.group || '0');
            if (cellGroup === groupNumber) {
                return true;
            }
        }
        return false;
    }

    private resetGroups(container: HTMLElement): void {
        this.currentGroup = 1;
        const cells = container.querySelectorAll('.matrix-cell');
        for (const cell of Array.from(cells)) {
            const cellElement = cell as HTMLElement;
            cellElement.dataset.group = '0';
            cellElement.style.backgroundColor = '#fff';
            cellElement.style.color = '#333';
            cellElement.style.fontWeight = 'normal';
            cellElement.classList.remove('selecting');
        }
    }

    private updateGroupDisplay(displayElement: HTMLElement): void {
        displayElement.textContent = this.currentGroup.toString();
        displayElement.style.backgroundColor = this.groupColors[this.currentGroup - 1];
    }

    private showMatrix(container: HTMLElement): void {
        const matrix: number[][] = [];
        const rows = container.querySelectorAll('.matrix-row');

        for (const row of Array.from(rows)) {
            const matrixRow: number[] = [];
            const cells = row.querySelectorAll('.matrix-cell');
            for (const cell of Array.from(cells)) {
                const cellElement = cell as HTMLElement;
                const group = Number.parseInt(cellElement.dataset.group || '0');
                matrixRow.push(group);
            }
            matrix.push(matrixRow);
        }

        // Validar que todos los grupos sean rectangulares
        if (!this.validateGroupsAreRectangular(matrix)) {
            this.showErrorMessage('Los grupos deben ser cuadrados o rectangulares. Por favor, corrige los grupos.');
            return;
        }

        // Enviar el evento de matriz generada
        this.element.dispatchEvent(new CustomEvent('matrix_generated', { detail: { matrix } }));

        // Mostrar mensaje de confirmación
        this.showConfirmationMessage(matrix);
    }

    private validateGroupsAreRectangular(matrix: number[][]): boolean {
        // Obtener todos los grupos únicos (excepto 0)
        const uniqueGroups = new Set<number>();
        for (const row of matrix) {
            for (const cell of row) {
                if (cell !== 0) {
                    uniqueGroups.add(cell);
                }
            }
        }

        // Validar cada grupo
        for (const group of uniqueGroups) {
            if (!this.isGroupRectangular(matrix, group)) {
                return false;
            }
        }

        return true;
    }

    private isGroupRectangular(matrix: number[][], groupNumber: number): boolean {
        // Encontrar todas las posiciones del grupo
        const positions: Array<{ row: number; col: number }> = [];
        for (const [i, row] of matrix.entries()) {
            for (const [j, cell] of row.entries()) {
                if (cell === groupNumber) {
                    positions.push({ row: i, col: j });
                }
            }
        }

        if (positions.length === 0) return true;

        // Encontrar los límites del rectángulo
        const minRow = Math.min(...positions.map(p => p.row));
        const maxRow = Math.max(...positions.map(p => p.row));
        const minCol = Math.min(...positions.map(p => p.col));
        const maxCol = Math.max(...positions.map(p => p.col));

        // Calcular el área esperada del rectángulo
        const expectedArea = (maxRow - minRow + 1) * (maxCol - minCol + 1);

        // Si el número de celdas coincide con el área esperada, es rectangular
        if (positions.length !== expectedArea) {
            return false;
        }

        // Verificar que todas las celdas dentro del rectángulo pertenezcan al grupo
        for (let i = minRow; i <= maxRow; i++) {
            for (let j = minCol; j <= maxCol; j++) {
                if (matrix[i][j] !== groupNumber) {
                    return false;
                }
            }
        }

        return true;
    }

    private showConfirmationMessage(matrix: number[][]): void {
        // Buscar el contenedor del mensaje
        const messageContainer = document.getElementById('matrix-message-container');
        if (!messageContainer) return;

        // Crear el mensaje de confirmación
        const message = document.createElement('div');
        message.className = 'confirmation-message';

        // Icono de check
        const checkIcon = document.createElement('span');
        checkIcon.textContent = '✓';
        checkIcon.className = 'check-icon';

        // Texto del mensaje
        const messageText = document.createElement('span');
        messageText.textContent = 'Layout guardado exitosamente';

        // Ensamblar el mensaje
        message.appendChild(checkIcon);
        message.appendChild(messageText);

        // Limpiar cualquier mensaje anterior
        messageContainer.innerHTML = '';
        messageContainer.appendChild(message);

        // Animar entrada
        setTimeout(() => {
            message.classList.add('show');
        }, 10);

        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            message.classList.remove('show');

            // Remover del DOM después de la animación
            setTimeout(() => {
                if (messageContainer.contains(message)) {
                    message.remove();
                }
            }, 300);
        }, 3000);
    }

    private showErrorMessage(errorText: string): void {
        // Buscar el contenedor del mensaje
        const messageContainer = document.getElementById('matrix-message-container');
        if (!messageContainer) return;

        // Crear el mensaje de error
        const message = document.createElement('div');
        message.className = 'confirmation-message error-message';
        message.style.background = '#e74c3c';

        // Icono de error
        const errorIcon = document.createElement('span');
        errorIcon.textContent = '✗';
        errorIcon.className = 'check-icon';

        // Texto del mensaje
        const messageText = document.createElement('span');
        messageText.textContent = errorText;

        // Ensamblar el mensaje
        message.appendChild(errorIcon);
        message.appendChild(messageText);

        // Limpiar cualquier mensaje anterior
        messageContainer.innerHTML = '';
        messageContainer.appendChild(message);

        // Animar entrada
        setTimeout(() => {
            message.classList.add('show');
        }, 10);

        // Auto-ocultar después de 4 segundos
        setTimeout(() => {
            message.classList.remove('show');

            // Remover del DOM después de la animación
            setTimeout(() => {
                if (messageContainer.contains(message)) {
                    message.remove();
                }
            }, 300);
        }, 4000);
    }

    private generateMatrix(rows: number, columns: number): number[][] {
        const matrix: number[][] = [];
        let value = 1;

        console.log(`=== Generando matriz de ${rows}x${columns} ===`);

        for (let i = 0; i < rows; i++) {
            const row: number[] = [];
            for (let j = 0; j < columns; j++) {
                row.push(value);
                value++;
            }
            matrix.push(row);
        }

        console.log("=== Matriz generada:", matrix, "===");
        return matrix;
    }

    plot(params: MatrixParams): HTMLElement {
        let { matrix, rows, columns } = params;

        // Si la matriz está vacía o no existe, generar una nueva basada en rows y columns
        if (!matrix || matrix.length === 0 || (matrix.length === 1 && matrix[0].length === 0)) {
            const rowCount = rows || 3;
            const colCount = columns || 3;
            matrix = this.generateMatrix(rowCount, colCount);
        }

        const node = this.create_node();

        // Crear contenedor para la matriz y el mensaje
        const leftContainer = document.createElement("div");
        leftContainer.className = "matrix-container";

        // Crear la matriz interactiva
        const matrixGrid = this.createMatrixGrid(matrix);

        // Crear contenedor para el mensaje de confirmación
        const messageContainer = document.createElement("div");
        messageContainer.id = "matrix-message-container";
        messageContainer.className = "message-container";

        // Agregar matriz y mensaje al contenedor izquierdo
        leftContainer.appendChild(matrixGrid);
        leftContainer.appendChild(messageContainer);

        // Crear el panel de control
        const controlPanel = this.createControlPanel(leftContainer);

        // Agregar elementos al nodo principal (matriz a la izquierda, controles a la derecha)
        node.appendChild(leftContainer);
        node.appendChild(controlPanel);

        return node;
    }
}

export class MatrixCreatorModel extends BaseModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: MatrixCreatorModel.model_name,
            _view_name: MatrixCreatorModel.view_name,
            matrix: [],
            grid_areas: [],
            rows: 3,
            columns: 3,
        };
    }
    public static readonly model_name = "MatrixCreatorModel";
    public static readonly view_name = "MatrixCreatorView";
}

export class MatrixCreatorView extends BaseView<MatrixCreator> {
    params(): MatrixParams {
        const rowsStr = this.model.get("rows");
        const columnsStr = this.model.get("columns");

        return {
            matrix: this.model.get("matrix"),
            grid_areas: this.model.get("grid_areas"),
            rows: rowsStr ? Number.parseInt(rowsStr) : 3,
            columns: columnsStr ? Number.parseInt(columnsStr) : 3,
        };
    }

    plot(element: HTMLElement): void {
        const matrixCreator = new MatrixCreator(element);
        const params = this.params();

        const node = matrixCreator.plot(params);
        element.appendChild(node);

        // NUEVO: escuchar el evento y sincronizar con Python
        element.addEventListener('matrix_generated', (ev: Event) => {
            const e = ev as CustomEvent<{ matrix: number[][] }>;
            const matrix = e.detail.matrix;

            // Actualiza el trait 'matrix' para que Python lo reciba
            this.model.set({ matrix });
            this.model.save_changes();

            // Envía también un mensaje custom si quieres manejar callbacks en Python
            this.send({ event: 'matrix_generated', matrix });
        });
    }
}
