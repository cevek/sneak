///<reference path="Sneak.ts"/>
///<reference path="View.ts"/>
var sneak;
(function (sneak) {
    (function (Direction) {
        Direction[Direction["UP"] = 0] = "UP";
        Direction[Direction["DOWN"] = 1] = "DOWN";
        Direction[Direction["LEFT"] = 2] = "LEFT";
        Direction[Direction["RIGHT"] = 3] = "RIGHT";
    })(sneak.Direction || (sneak.Direction = {}));
    var Direction = sneak.Direction;
    /**
     * Модель точки
     */
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.isEqual = function (point) {
            return this.x == point.x && this.y == point.y;
        };
        return Point;
    })();
    sneak.Point = Point;
    /**
     * Игровое поле
     */
    var Field = (function () {
        function Field() {
            this.width = 20;
            this.height = 20;
        }
        /**
         * Находится ли точка за пределами филда
         */
        Field.prototype.isOutside = function (point) {
            return point.x >= this.width || point.x < 0 || point.y < 0 || point.y >= this.width;
        };
        /**
         * Генерит случайную точку
         */
        Field.prototype.getRandomPoint = function () {
            var x = Math.floor(Math.random() * this.width);
            var y = Math.floor(Math.random() * this.height);
            return new Point(x, y);
        };
        return Field;
    })();
    sneak.Field = Field;
    /**
     * Модель игры
     */
    var Game = (function () {
        function Game(rootNode) {
            this.field = new Field();
            this.interval = 200;
            this.view = new sneak.View(this, rootNode);
            this.init();
        }
        Game.prototype.init = function () {
            this.sneak = new sneak.Sneak(this.field);
            this.createFood();
            this.step();
        };
        /**
         * Очередной шаг игры
         */
        Game.prototype.step = function () {
            var _this = this;
            if (this.sneak.moveNext()) {
                if (this.sneak.isCrossed(this.nextFood)) {
                    this.sneak.eat(this.nextFood);
                    this.createFood();
                }
                this.updateView();
                setTimeout(function () { return _this.step(); }, this.interval);
            }
            else {
                this.view.showLost();
            }
        };
        Game.prototype.updateView = function () {
            this.view.update(this.sneak.points.concat(this.nextFood));
        };
        /**
         * Создать еду
         */
        Game.prototype.createFood = function () {
            var _this = this;
            while (true) {
                this.nextFood = this.field.getRandomPoint();
                if (this.sneak.points.every(function (point) { return !_this.nextFood.isEqual(point); })) {
                    break;
                }
            }
        };
        Game.prototype.reset = function () {
            this.init();
            this.view.reset();
        };
        return Game;
    })();
    sneak.Game = Game;
})(sneak || (sneak = {}));
//# sourceMappingURL=Game.js.map