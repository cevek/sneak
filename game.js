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
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
var Sneak = (function () {
    function Sneak(field) {
        this.field = field;
        this.points = [];
        this.direction = Direction.DOWN;
        this.points.push(this.field.getRandomPoint());
    }
    Sneak.prototype.isCrossed = function (point) {
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            if (point.isEqual(p)) {
                return true;
            }
        }
        return false;
    };
    Sneak.prototype.crossMySelf = function (nextPoint) {
        return this.points.some(function (point) { return point.isEqual(nextPoint); });
    };
    Sneak.prototype.moveNext = function () {
        var lastPoint = this.points[this.points.length - 1];
        var nextX = lastPoint.x;
        var nextY = lastPoint.y;
        switch (this.direction) {
            case Direction.LEFT:
                nextX--;
                break;
            case Direction.RIGHT:
                nextX++;
                break;
            case Direction.UP:
                nextY--;
                break;
            case Direction.DOWN:
                nextY++;
                break;
        }
        var nextPoint = new Point(nextX, nextY);
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
    Sneak.prototype.eat = function (point) {
        this.points.push(point);
        this.moveNext();
    };
    return Sneak;
})();
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
var View = (function () {
    function View(field, sneak, parentNode) {
        var _this = this;
        this.field = field;
        this.sneak = sneak;
        this.points = [];
        document.addEventListener('keydown', function (e) { return _this.keyPress(e); });
        var lostNode = parentNode.getElementsByClassName('.lost')[0];
        for (var i = 0; i < field.height; i++) {
            var row = document.createElement('div');
            parentNode.appendChild(row);
            for (var j = 0; j < field.width; j++) {
                var div = ViewPoint.createDiv();
                var vp = new ViewPoint(div, false);
                row.appendChild(div);
                this.points.push(vp);
            }
        }
    }
    View.prototype.keyPress = function (e) {
        switch (e.which) {
            case 37:
                this.sneak.setDirection(Direction.LEFT);
                break;
            case 38:
                this.sneak.setDirection(Direction.UP);
                break;
            case 39:
                this.sneak.setDirection(Direction.RIGHT);
                break;
            case 40:
                this.sneak.setDirection(Direction.DOWN);
                break;
        }
    };
    View.prototype.getIndexPoint = function (point) {
        return point.y * this.field.width + point.x;
    };
    View.prototype.update = function (filledPoints) {
        var _this = this;
        this.points.forEach(function (viewPoint) {
            viewPoint.filled = false;
        });
        filledPoints.forEach(function (point) {
            var index = _this.getIndexPoint(point);
            _this.points[index].filled = true;
        });
        this.points.forEach(function (viewPoint, index) {
            viewPoint.update();
        });
    };
    return View;
})();
var Field = (function () {
    function Field() {
        this.width = 20;
        this.height = 20;
    }
    Field.prototype.isOutside = function (point) {
        return point.x >= this.width || point.x < 0 || point.y < 0 || point.y >= this.width;
    };
    Field.prototype.getRandomPoint = function () {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        return new Point(x, y);
    };
    return Field;
})();
var Game = (function () {
    function Game(rootNode) {
        this.width = 20;
        this.height = 20;
        this.field = new Field();
        this.sneak = new Sneak(this.field);
        this.interval = 200;
        this.view = new View(this.field, this.sneak, rootNode);
        this.createFood();
        this.step();
    }
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
            this.view;
        }
    };
    Game.prototype.updateView = function () {
        this.view.update(this.sneak.points.concat(this.nextFood));
    };
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
    };
    return Game;
})();
new Game(document.getElementById('game'));
//# sourceMappingURL=game.js.map