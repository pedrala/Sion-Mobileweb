const touchEvent = {
  data() {
    return {
      bStartEvent: false,
      bMoveEvent: false,
      x: -1,
      y: -1,
    }
  },
  methods: {
    onTouchStart(e) {
      const self = this;
      self.x = e.changedTouches[0].pageX;
      self.y = e.changedTouches[0].pageY;
      self.bStartEvent = true;
    },
    onTouchMove() {
      const self = this;
      self.bMoveEvent = true;
    },
    onTouchEnd(e) {
      const self = this;
      if (self.bStartEvent && self.bMoveEvent) {
        var x = e.changedTouches[0].pageX;
        var y = e.changedTouches[0].pageY;

        var nMoveType = -1;
        var nX = Math.abs(self.x - x);
        var nY = Math.abs(self.y - y);
        
        // 현재 움직인 거리와 기준거리 비교 (100 민감도)
        if (nX > 100 && nY < 25) {
          // 수평 방향을 판단하는 기준 기울기
          var nHSlope = ((window.innerHeight / 2) / window.innerWidth).toFixed(2) * 1;

          var nSlope = parseFloat((nY / nX).toFixed(2), 10);

          if (nSlope > nHSlope) {
            //수직방향
            nMoveType = 1;
          } else {
            //수평방향
            nMoveType = 0;
          }

          if (nMoveType == 0) {
            if (self.x - x > 0) {
              // swipe left
              self.$EventBus.$emit("swipeLeft");
            } else {
              // swipe right
              self.$EventBus.$emit("swipeRight");
            }
          }
        }
      }
      self.bStartEvent = false;
      self.bMoveEvent = false;
    },
  },
  mounted() {
    const self = this;
    self.$el.addEventListener('touchstart', self.onTouchStart);
    self.$el.addEventListener('touchmove', self.onTouchMove);
    self.$el.addEventListener('touchend', self.onTouchEnd);
  },
  beforeDestroy() {
    const self = this;
    self.$el.removeEventListener("touchstart", self.onTouchStart);
    self.$el.removeEventListener("touchmove", self.onTouchMove);
    self.$el.removeEventListener("touchend", self.onTouchEnd);
  }
}
export default touchEvent;
