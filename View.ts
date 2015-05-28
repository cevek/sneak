///<reference path="Sneak2.ts"/>
module sneak{
    /**
     * Объект вьюшной точки
     */
    export class ViewPoint {
        div:HTMLDivElement;
        filled:boolean;

        constructor(div:HTMLDivElement, filled:boolean) {
            this.div = div;
            this.filled = filled;
        }

        update() {
            if (this.filled) {
                this.div.classList.add('filled');
            } else {
                this.div.classList.remove('filled');
            }
        }

        static createDiv() {
            var div = document.createElement('div');
            div.classList.add('point');
            return div;
        }
    }

    /**
     * Вьюшка игры
     */
    export class View {
        //коллекция игровых точек
        viewPoints:ViewPoint[] = [];
        //div проигрыша
        lostNode:HTMLElement;
        //кнопка сброса
        lostNodeButton:HTMLElement;
        //модель игры
        game:Game;

        constructor(game:Game, parentNode:HTMLElement) {
            this.game = game;
            document.addEventListener('keydown', (e:KeyboardEvent)=>this.keyPress(e));
            this.lostNode = <HTMLElement>parentNode.querySelector('.lost');
            this.lostNodeButton = <HTMLElement>this.lostNode.querySelector('button');
            this.lostNodeButton.addEventListener('click', ()=>this.game.reset());
            this.createPoints(parentNode);
        }

        createPoints(parentNode:Node) {
            for (var i = 0; i < this.game.field.height; i++) {
                var row = document.createElement('div');
                parentNode.appendChild(row);
                for (var j = 0; j < this.game.field.width; j++) {
                    var div = ViewPoint.createDiv();
                    var vp = new ViewPoint(div, false);
                    row.appendChild(div);
                    this.viewPoints.push(vp);
                }
            }
        }

        keyPress(e:KeyboardEvent) {
            switch (e.which) {
                case 37:
                    this.game.sneak.setDirection(Direction.LEFT);
                    break;
                case 38:
                    this.game.sneak.setDirection(Direction.UP);
                    break;
                case 39:
                    this.game.sneak.setDirection(Direction.RIGHT);
                    break;
                case 40:
                    this.game.sneak.setDirection(Direction.DOWN);
                    break;
            }
        }

        /**
         * Получить индекс в коллекции viewPoints
         */
        getIndexPoint(point:Point) {
            return point.y * this.game.field.width + point.x;
        }

        /**
         * Обновить всю вьюшку
         * на входе все закрашенные точки
         */
        update(filledPoints:Point[]) {
            this.viewPoints.forEach((viewPoint) => {
                viewPoint.filled = false;
            });
            filledPoints.forEach(point => {
                var index = this.getIndexPoint(point);
                this.viewPoints[index].filled = true;
            });
            this.viewPoints.forEach((viewPoint, index) => {
                viewPoint.update();
            });
        }

        reset() {
            this.hideLost();
        }

        /**
         * Показать проигрыш
         */
        showLost() {
            this.lostNode.classList.add('show');
        }

        hideLost() {
            this.lostNode.classList.remove('show');
        }
    }
}