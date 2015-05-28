///<reference path="Game.ts"/>
var sneak;
(function (sneak) {
    /**
     * Модель змейки
     */
    var Sneak = (function () {
        function Sneak(field) {
            this.points = [];
            this.direction = sneak.Direction.DOWN;
            this.field = field;
            this.points.push(this.field.getRandomPoint());
        }
        /**
         * Пересечение с точкой
         */
        Sneak.prototype.isCrossed = function (point) {
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var p = _a[_i];
                if (point.isEqual(p)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Пересекли себя
         */
        Sneak.prototype.crossMySelf = function (nextPoint) {
            return this.points.some(function (point) { return point.isEqual(nextPoint); });
        };
        /**
         * Сдвинуть змейку
         * возвращает true если удалось сдвинуть, false если нет - проигрыш
         */
        Sneak.prototype.moveNext = function () {
            var lastPoint = this.points[this.points.length - 1];
            var nextX = lastPoint.x;
            var nextY = lastPoint.y;
            switch (this.direction) {
                case sneak.Direction.LEFT:
                    nextX--;
                    break;
                case sneak.Direction.RIGHT:
                    nextX++;
                    break;
                case sneak.Direction.UP:
                    nextY--;
                    break;
                case sneak.Direction.DOWN:
                    nextY++;
                    break;
            }
            var nextPoint = new sneak.Point(nextX, nextY);
            if (this.field.isOutside(nextPoint) || this.crossMySelf(nextPoint)) {
                return false;
            }
            this.points.shift();
            this.points.push(nextPoint);
            return true;
        };
        Sneak.prototype.setDirection = function (dir) {
            this.direction = dir;
        };
        /**
         * Съесть еду
         */
        Sneak.prototype.eat = function (point) {
            this.points.push(point);
            this.moveNext();
        };
        return Sneak;
    })();
    sneak.Sneak = Sneak;
})(sneak || (sneak = {}));
//# sourceMappingURL=Sneak.js.map