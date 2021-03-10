// 礼花点击特效

class Circle {
    constructor({
        origin,
        speed,
        color,
        angle,
        context
    }) {
        this.origin = origin
        this.position = {
            ...this.origin
        }
        this.color = color
        this.speed = speed
        this.angle = angle
        this.context = context
        this.renderCount = 0
    }

    draw() {
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
        this.context.fill()
    }

    move() {
        this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
        this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
        this.renderCount++
    }
}

class Boom {
    constructor({
        origin,
        context,
        circleCount = 16,
        area
    }) {
        this.origin = origin
        this.context = context
        this.circleCount = circleCount
        this.area = area
        this.stop = false
        this.circles = []
    }

    randomArray(range) {
        const length = range.length
        const randomIndex = Math.floor(length * Math.random())
        return range[randomIndex]
    }

    randomColor() {
        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(
            range) + this.randomArray(range) + this.randomArray(range)
    }

    randomRange(start, end) {
        return (end - start) * Math.random() + start
    }

    init() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = new Circle({
                context: this.context,
                origin: this.origin,
                color: this.randomColor(),
                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                speed: this.randomRange(1, 6)
            })
            this.circles.push(circle)
        }
    }

    move() {
        this.circles.forEach((circle, index) => {
            if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                return this.circles.splice(index, 1)
            }
            circle.move()
        })
        if (this.circles.length == 0) {
            this.stop = true
        }
    }

    draw() {
        this.circles.forEach(circle => circle.draw())
    }
}

class CursorSpecialEffects {
    constructor() {
        this.computerCanvas = document.createElement('canvas')
        this.renderCanvas = document.createElement('canvas')

        this.computerContext = this.computerCanvas.getContext('2d')
        this.renderContext = this.renderCanvas.getContext('2d')

        this.globalWidth = window.innerWidth
        this.globalHeight = window.innerHeight

        this.booms = []
        this.running = false
    }

    handleMouseDown(e) {
        const boom = new Boom({
            origin: {
                x: e.clientX,
                y: e.clientY
            },
            context: this.computerContext,
            area: {
                width: this.globalWidth,
                height: this.globalHeight
            }
        })
        boom.init()
        this.booms.push(boom)
        this.running || this.run()
    }

    handlePageHide() {
        this.booms = []
        this.running = false
    }

    init() {
        const style = this.renderCanvas.style
        style.position = 'fixed'
        style.top = style.left = 0
        style.zIndex = '999999999999999999999999999999999999999999'
        style.pointerEvents = 'none'

        style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
        style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

        document.body.append(this.renderCanvas)

        window.addEventListener('mousedown', this.handleMouseDown.bind(this))
        window.addEventListener('pagehide', this.handlePageHide.bind(this))
    }

    run() {
        this.running = true
        if (this.booms.length == 0) {
            return this.running = false
        }

        requestAnimationFrame(this.run.bind(this))

        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

        this.booms.forEach((boom, index) => {
            if (boom.stop) {
                return this.booms.splice(index, 1)
            }
            boom.move()
            boom.draw()
        })
        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
    }
}

const cursorSpecialEffects = new CursorSpecialEffects()
cursorSpecialEffects.init()

// 雪花飘落特效

var stop, staticx;
var img = new Image();
img.src =
    "data:image/png;base64,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";
function Sakura(x, y, s, r, fn) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fn = fn;
}
Sakura.prototype.draw = function(cxt) {
    cxt.save();
    var xc = 40 * this.s / 4;
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
    cxt.restore();
}
Sakura.prototype.update = function() {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
    this.r = this.fn.r(this.r);
    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
        this.r = getRandom('fnr');
        if (Math.random() > 0.4) {
            this.x = getRandom('x');
            this.y = 0;
            this.s = getRandom('s');
            this.r = getRandom('r');
        } else {
            this.x = window.innerWidth;
            this.y = getRandom('y');
            this.s = getRandom('s');
            this.r = getRandom('r');
        }
    }
}
SakuraList = function() {
    this.list = [];
}
SakuraList.prototype.push = function(sakura) {
    this.list.push(sakura);
}
SakuraList.prototype.update = function() {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].update();
    }
}
SakuraList.prototype.draw = function(cxt) {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].draw(cxt);
    }
}
SakuraList.prototype.get = function(i) {
    return this.list[i];
}
SakuraList.prototype.size = function() {
    return this.list.length;
}

function getRandom(option) {
    var ret, random;
    switch (option) {
        case 'x':
            ret = Math.random() * window.innerWidth;
            break;
        case 'y':
            ret = Math.random() * window.innerHeight;
            break;
        case 's':
            ret = Math.random();
            break;
        case 'r':
            ret = Math.random() * 6;
            break;
        case 'fnx':
            random = -0.5 + Math.random() * 1;
            ret = function(x, y) {
                return x + 0.5 * random - 1.7;
            };
            break;
        case 'fny':
            random = 1.5 + Math.random() * 0.7
            ret = function(x, y) {
                return y + random;
            };
            break;
        case 'fnr':
            random = Math.random() * 0.03;
            ret = function(r) {
                return r + random;
            };
            break;
    }
    return ret;
}

function startSakura() {
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame || window.oRequestAnimationFrame;
    var canvas = document.createElement('canvas'),
        cxt;
    staticx = true;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
    canvas.setAttribute('id', 'canvas_sakura');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    cxt = canvas.getContext('2d');
    var sakuraList = new SakuraList();
    for (var i = 0; i < 50; i++) {
        var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny;
        randomX = getRandom('x');
        randomY = getRandom('y');
        randomR = getRandom('r');
        randomS = getRandom('s');
        randomFnx = getRandom('fnx');
        randomFny = getRandom('fny');
        randomFnR = getRandom('fnr');
        sakura = new Sakura(randomX, randomY, randomS, randomR, {
            x: randomFnx,
            y: randomFny,
            r: randomFnR
        });
        sakura.draw(cxt);
        sakuraList.push(sakura);
    }
    stop = requestAnimationFrame(function() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        sakuraList.update();
        sakuraList.draw(cxt);
        stop = requestAnimationFrame(arguments.callee);
    })
}
window.onresize = function() {
    var canvasSnow = document.getElementById('canvas_snow');
}
img.onload = function() {
    startSakura();
}

function stopp() {
    if (staticx) {
        var child = document.getElementById("canvas_sakura");
        child.parentNode.removeChild(child);
        window.cancelAnimationFrame(stop);
        staticx = false;
    } else {
        startSakura();
    }
}

var full_page = document.getElementsByClassName("full_page");
if (full_page.length != 0) {
  full_page[0].style.background = "transparent";
}