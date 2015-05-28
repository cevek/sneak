///<reference path="Game.ts"/>
module sneak {
    /**
     * Модель змейки
     */
    export class Sneak {
        points:Point[] = [];
        direction:Direction = Direction.DOWN;
        field:Field;

        constructor(field:Field) {
            this.field = field;
            this.points.push(this.field.getRandomPoint());
        }

        /**
         * Пересечение с точкой
         */
        isCrossed(point:Point) {
            for (var p of this.points) {
                if (point.isEqual(p)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Пересекли себя
         */
        crossMySelf(nextPoint:Point) {
            return this.points.some(point => point.isEqual(nextPoint));
        }

        /**
         * Сдвинуть змейку
         * возвращает true если удалось сдвинуть, false если нет - проигрыш
         */
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

        /**
         * Съесть еду
         */
        eat(point:Point) {
            this.points.push(point);
            this.moveNext();
        }
    }
}