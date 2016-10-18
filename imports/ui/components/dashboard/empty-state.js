class emptyState {
  beforeRegister(){
    this.is = "empty-state";
    this.properties = {
      canvasWidth:{
        type:Number,
        value:function(){
          return this.offsetWidth / 2;
        }
      },
      canvasHeight:{
        type:Number,
        value:function(){
          return 200;
        }
      },
      sx:{
        type:Number,
        value:300
      },
      sy:{
        type:Number,
        value:200
      },
      ex:{
        type:Number,
        value:300
      },
      ey:{
        type:Number,
        value:10
      },
      startX:{
        type:Number,
        value:10
      },   
      startY:{
        type:Number,
        value:200
      },
    };
    this.listeners = {
      "iron-resize":"drawArrow"
    };
  }
  get behaviors(){
    return [
      Polymer.IronResizableBehavior
    ];
  }
  attached(){
    this.async(()=>{

      this.drawArrow();
    },1000);
  }
  clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }
  drawArrow(){
    const can = this.$.arrow;
    const ctx = can.getContext('2d');
    this.clearCanvas(ctx,can);
    const target = document.querySelector("#addNew");
    const targetDm = target.getBoundingClientRect();
    const toolbarWidth = Polymer.dom(target).parentNode.offsetWidth;
    if(toolbarWidth > 768){
      this.startY = 200 ;
      this.startX = this.$.content.offsetWidth / 2;
      this.sx =  350;
      // takes the position of addNew button with
      this.ex = targetDm.left - toolbarWidth / 2 + targetDm.width / 2 - 50;
      this.ey = targetDm.top + 10;
    }
    else{
      this.startY = this.$.content.offsetHeight / 2 ;
      this.startX = 0;
      this.sx =  80;
      // takes the position of addNew button with
      this.ex = targetDm.left - toolbarWidth / 2 + targetDm.width / 2;
      this.ey = targetDm.top;
    }
    this.canvasWidth =  this.offsetWidth / 2;
    function drawArrowhead(locx, locy, angle, sizex, sizey) {
      const hx = sizex / 2;
      const hy = sizey / 2;
      ctx.translate((locx ), (locy));
      ctx.rotate(angle);
      ctx.translate(-hx,-hy);

      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(0,1*sizey);    
      ctx.lineTo(1*sizex,1*hy);
      ctx.closePath();
      ctx.fill();
    }


    // returns radians
    function findAngle(sx, sy, ex, ey) {
      // make sx and sy at the zero point
      return Math.atan((ey - sy) / (ex - sx));
    }

    const sx = this.sx;
    const sy = this.sy;
    const ex = this.ex;
    const ey = this.ey;

    ctx.beginPath();
    ctx.fillStyle = "#555";
    ctx.moveTo(this.startX,this.startY);
    ctx.quadraticCurveTo(sx, sy, ex, ey);
    ctx.stroke();

    const ang = findAngle(sx, sy, ex, ey);
    ctx.fillRect(ex, ey, 1, 1);
    drawArrowhead(ex, ey, ang, 12, 12);


  }
}
Polymer(emptyState);
