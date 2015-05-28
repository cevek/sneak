///<reference path="Sneak.ts"/>
var sneak;
(function (sneak) {
    /**
     * Объект вьюшной точки
     */
    var ViewPoint = (function () {
        function ViewPoint(div, filled) {
            this.div = div;
            this.filled = filled;
        }
        ViewPoint.prototype.update = function () {
            if (this.filled) {
                this.div.classList.add('filled');
            }
            else {
                this.div.classList.remove('filled');
            }
        };
        ViewPoint.createDiv = function () {
            var div = document.createElement('div');
            div.classList.add('point');
            return div;
        };
        return ViewPoint;
    })();
    sneak.ViewPoint = ViewPoint;
    /**
     * Вьюшка игры
     */
    var View = (function () {
        function View(game, parentNode) {
            var _this = this;
            //коллекция игровых точек
            this.viewPoints = [];
            this.game = game;
            document.addEventListener('keydown', function (e) { return _this.keyPress(e); });
            this.lostNode = parentNode.querySelector('.lost');
            this.lostNodeButton = this.lostNode.querySelector('button');
            this.lostNodeButton.addEventListener('click', function () { return _this.game.reset(); });
            this.createPoints(parentNode);
        }
        View.prototype.createPoints = function (parentNode) {
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
        };
        View.prototype.keyPress = function (e) {
            switch (e.which) {
                case 37:
                    this.game.sneak.setDirection(sneak.Direction.LEFT);
                    break;
                case 38:
                    this.game.sneak.setDirection(sneak.Direction.UP);
                    break;
                case 39:
                    this.game.sneak.setDirection(sneak.Direction.RIGHT);
                    break;
                case 40:
                    this.game.sneak.setDirection(sneak.Direction.DOWN);
                    break;
            }
        };
        /**
         * Получить индекс в коллекции viewPoints
         */
        View.prototype.getIndexPoint = function (point) {
            return point.y * this.game.field.width + point.x;
        };
        /**
         * Обновить всю вьюшку
         * на входе все закрашенные точки
         */
        View.prototype.update = function (filledPoints) {
            var _this = this;
            this.viewPoints.forEach(function (viewPoint) {
                viewPoint.filled = false;
            });
            filledPoints.forEach(function (point) {
                var index = _this.getIndexPoint(point);
                _this.viewPoints[index].filled = true;
            });
            this.viewPoints.forEach(function (viewPoint, index) {
                viewPoint.update();
            });
        };
        View.prototype.reset = function () {
            this.hideLost();
        };
        /**
         * Показать проигрыш
         */
        View.prototype.showLost = function () {
            this.lostNode.classList.add('show');
        };
        View.prototype.hideLost = function () {
            this.lostNode.classList.remove('show');
        };
        return View;
    })();
    sneak.View = View;
})(sneak || (sneak = {}));
//# sourceMappingURL=View.js.map