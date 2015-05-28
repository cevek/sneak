class Point {
    constructor(public x:number, public y:number) {
    }

    isEqual(point:Point) {
        return this.x == point.x && this.y == point.y;
    }
}

enum Direction{
    UP, DOWN, LEFT, RIGHT
}

class Sneak {
    points:Point[] = [];
    direction:Direction = Direction.DOWN;

    constructor(public field:Field) {
        this.points.push(this.field.getRandomPoint());
    }

    isCrossed(point:Point) {
        for (var p of this.points) {
            if (point.isEqual(p)) {
                return true;
            }
        }
        return false;
    }

    crossMySelf(nextPoint:Point) {
        return this.points.some(point => point.isEqual(nextPoint));
    }

    moveNext() {
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
    }

    setDirection(dir:Direction) {
        this.direction = dir;
    }

    eat(point:Point) {
        this.points.push(point);
        this.moveNext();
    }

}

class ViewPoint {
    div:HTMLDivElement;
    filled:boolean;

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


    constructor(div:HTMLDivElement, filled:boolean) {
        this.div = div;
        this.filled = filled;
    }
}

class View {
    points:ViewPoint[] = [];

    constructor(public field:Field, public sneak:Sneak, parentNode:HTMLElement) {
        document.addEventListener('keydown', (e:KeyboardEvent)=>this.keyPress(e));
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

    keyPress(e:KeyboardEvent) {
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
    }

    getIndexPoint(point:Point) {
        return point.y * this.field.width + point.x;
    }

    update(filledPoints:Point[]) {
        this.points.forEach((viewPoint) => {
            viewPoint.filled = false;
        });
        filledPoints.forEach(point => {
            var index = this.getIndexPoint(point);
            this.points[index].filled = true;
        });
        this.points.forEach((viewPoint, index) => {
            viewPoint.update();
        });
    }


}

class Field {
    width = 20;
    height = 20;

    isOutside(point:Point) {
        return point.x >= this.width || point.x < 0 || point.y < 0 || point.y >= this.width;
    }

    getRandomPoint() {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        return new Point(x, y);
    }
}

class Game {
    width = 20;
    height = 20;
    nextFood:Point;
    field = new Field();
    sneak = new Sneak(this.field);
    view:View;
    interval = 200;

    step() {
        if (this.sneak.moveNext()) {
            if (this.sneak.isCrossed(this.nextFood)) {
                this.sneak.eat(this.nextFood);
                this.createFood();
            }
            this.updateView();
            setTimeout(()=>this.step(), this.interval);
        }
        else {
            this.view
        }
    }

    updateView() {
        this.view.update(this.sneak.points.concat(this.nextFood));
    }

    constructor(rootNode:HTMLElement) {
        this.view = new View(this.field, this.sneak, rootNode);
        this.createFood();
        this.step();
    }

    createFood() {
        while (true) {
            this.nextFood = this.field.getRandomPoint();
            if (this.sneak.points.every(point => !this.nextFood.isEqual(point))) {
                break;
            }
        }
    }

    reset() {

    }
}

new Game(document.getElementById('game'));