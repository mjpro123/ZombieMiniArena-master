void new function Anticheat() {
const Encoder = new class Encoder {
   encode(e) {
       return function (e) {
           let t = 5, n = 48 + ~~(256 * Math.random());
           if ("object" != typeof e) return [];
           let o = [...e];
           o.push(n);
           for (let e = 0; e < o.length - 1; e++) o[e] ^= t, t = 10 * (t + 6) % 311, o[e] += n;
           return o
        }(function (e) {
           for (var t, n = [], o = 0; o < e.length; ++o) n.push((t = e.charCodeAt(o)) << 1 | t >>> 31);
           return new Uint16Array(n)
        }(JSON.stringify(e)))
   }
};
   try {
   function PacketEncoder() { 
      const StateManager = new (class {
         constructor() {
            this.mouseDown = false;
            window.addEventListener("mousedown", (event) => { if (event.isTrusted) this.mouseDown = true; });
            window.addEventListener("mouseup", (event) => { if (event.isTrusted) this.mouseDown = false; });
         }
      })();
      
      window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
         apply: function (e, t, i) {
            i[0] = Encoder.encode(i[0])   
            Function.prototype.apply.apply(e, [t, i]);
         }
      });
     }  

     PacketEncoder()
} catch(error) {
   console.error(error)
}


}
