
    //  Create randomOBJ

    function RandomObjectMover(obj, container) {
        this.$object = obj;
        this.$container = container;
        this.container_is_window = container === window;
        this.pixels_per_second = 250;
        this.current_position = { x: 0, y: 0 };
        this.is_running = false;
        this.isInfected = true;
    }

    // Set the speed of movement in Pixels per Second.
    RandomObjectMover.prototype.setSpeed = function (pxPerSec) {
        this.pixels_per_second = pxPerSec;
    }

    RandomObjectMover.prototype._getContainerDimensions = function () {
        if (this.$container === window) {
            return { 'height': this.$container.innerHeight, 'width': this.$container.innerWidth-500 };
        } else {
            return { 'height': this.$container.clientHeight, 'width': this.$container.clientWidth-500 };
        }
    }

    RandomObjectMover.prototype._generateNewPosition = function () {

        // Get container dimensions minus div size
        var containerSize = this._getContainerDimensions();
        var availableHeight = containerSize.height - this.$object.clientHeight;
        var availableWidth = containerSize.width - this.$object.clientHeight;

        // Pick a random place in the space
        var y = Math.floor(Math.random() * availableHeight);
        var x = Math.floor(Math.random() * availableWidth);

        return { x: x, y: y };
    }

    RandomObjectMover.prototype._calcDelta = function (a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;

        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
    }

    RandomObjectMover.prototype._isInfected = function(n){
        this.isInfected = n;
    }
    RandomObjectMover.prototype._isInfected = function(){
        return this.isInfected ;
    }

    RandomObjectMover.prototype._moveOnce = function () {
        // Pick a new spot on the page
        var next = this._generateNewPosition();

        // How far do we have to move?
        var delta = this._calcDelta(this.current_position, next);

        // Speed of this transition, rounded to 2DP
        var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;

        this.$object.style.transition = `transform ${speed}s linear`;
        this.$object.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        setTimeout(()=>{
            startWatch(this,this.$object,((delta/speed)*(next.x/next.y))*(delta/speed));
        },2000);
        // Save this new position ready for the next call.
        this.current_position = next;

    };

    RandomObjectMover.prototype.start = function () {

        if (this.is_running) {
            return;
        }

        // Make sure our object has the right css set
        this.$object.willChange = 'transform';
        this.$object.pointerEvents = 'auto';

        this.boundEvent = this._moveOnce.bind(this)

        // Bind callback to keep things moving
        this.$object.addEventListener('transitionend', this.boundEvent);

        // Start it moving
        this._moveOnce();

        this.is_running = true;
    }

    RandomObjectMover.prototype.stop = function () {

        if (!this.is_running) {
            return;
        }

        this.$object.removeEventListener('transitionend', this.boundEvent);

        this.is_running = false;
    }

    //Healthy persons Component

    let AppHealthy = {
            data: function () {

                return {
                    this_obj: this.arr,
                    that_ob : {}
                };
            },
            props: {
                arr: Array,
                empty_arr : Array
            },
            methods: {
                testament: function ($event) {
                    return $event.target;
                }
            },
            mounted: function () {
                let z = new RandomObjectMover(this.$refs.healty, window);


                // Toolbar stuff
                document.getElementById('start').addEventListener('click', function () {
                    z.start();
                });
                document.getElementById('stop').addEventListener('click', function () {
                    z.stop();
                });
                document.getElementById('speed').addEventListener('keyup', function () {
                    if (parseInt(this.value) > 3000) {
                        alert('حبس المرقة');
                        this.value = 250;
                    }
                    z.setSpeed(parseInt(this.value));
                });
                // Start it off
                z.start();
                this.that_ob=this.$refs.healty;
            },

            template: `<img ref="healty" @click="testament($event)" class="healthy rounded-circle" style="transition: transform 0.41s linear 0s; transform: translate3d(646px, 108px, 0px);"/>`

        }

    //Sick persons Component

     let AppSick = {
        data: function () {

            return {
                this_obj:this.zeropatient,
            };
        },
        props: [ "zeropatient"],
        methods: {
            testament: function ($event) {
                return $event.target;
            }
        },
        mounted: function () {
            let z = new RandomObjectMover(this.$refs.sick, window);


            // Toolbar stuff
            document.getElementById('start').addEventListener('click', function () {
                z.start();
            });
            document.getElementById('stop').addEventListener('click', function () {
                z.stop();
            });
            document.getElementById('speed').addEventListener('keyup', function () {
                if (parseInt(this.value) > 3000) {
                    alert('حبس المرقة');
                    this.value = 250;
                }
                z.setSpeed(parseInt(this.value));
            });
            // Start it off
            z.start();
            this.arr=this.$refs.sick;
            console.log(this.arr);
        },
        template: `<img ref="sick" @click="testament($event)" class=" sick rounded-circle"  style="transition: transform 0.41s linear 0s; transform: translate3d(646px, 108px, 0px);"/>`

    };

        //Start Vue init
        
        new Vue({
            el:"#toolbar",
            data:{
                empty_arr: [],
                personsLength: HealthyPersonsLength,
                zeropatient : 0,
            },
            methods: {
                start: function (){
                    for (let i = 1; i <= this.personsLength + 1; i++) {
                        this.empty_arr.push([]);
                    }
                    this.zeropatient = this.empty_arr[0];
                },
                addNewPersons: function (val) {

                    for (let i = 1; i <= +(val) ; i++) {
                        this.empty_arr.push([]);
                    }
                    this.zeropatient = this.empty_arr[0];
                    setTimeout(() => {
                        updateInfo();
                    }, 200);
                }
            },
            mounted :function(){
                this.start();
                setTimeout(() => {
                    updateInfo();
                }, 200);
            },
            watch:{
                empty_arr:function(){
                    this.empty_arr.forEach((item)=>{
                        //check Item References Obj
                        console.log(item);
                    });
                },
                personsLength: function (val) {
                    this.addNewPersons(val);
                }
            },
            components:{
                'app-sick':AppSick,
                'app-healthy': AppHealthy
                }
        });

        //Update Persons Info
        function updateInfo() {
            document.getElementById('sickP').innerText = `Number of Sick Perosns : ${document.getElementsByClassName('sick').length}`;
            document.getElementById('healthyP').innerText = `Number of Healthy Perosns : ${document.getElementsByClassName('healthy').length}`;
        }
        
        
        //Start watching Each obj State{connecte with patient , get; set; infection}
        async function startWatch(that, person, delta) {
            if (document.getElementsByClassName('healthy').length!=0) {
                if(that._isInfected()){
                    that._isInfected(false);
                    for (let personLazy of document.images) {
                        await look(personLazy,person,delta);
                    }
                }       
            }
        }


        //Obtain lines coordinate formula for calculate intersection's point
        async function look (personLazy,person,delta){
            let pz = personLazy.getBoundingClientRect();
            let pzT= personLazy.style.transform.match(/(-?[0-9\.]+)/g);
            let pfT = person.style.transform.match(/(-?[0-9\.]+)/g);
              if(intersects(pz.x,pz.y,pzT[0],pzT[1]  , person.x,person.y,pfT[0],pfT[1] )&& personLazy.classList.contains('sick')) {
                  
                    setTimeout(()=>{
                        person.classList.remove('healthy');
                        person.classList.add('sick');
                        updateInfo();
                    }, delta);
                }
        }


        //Calculate Line–line intersection and return boolean value of TRUE if two OBJ two lines intersect
        function intersects(a,b,c,d,p,q,r,s) {
            var det, gamma, lambda;
            det = (c - a) * (s - q) - (r - p) * (d - b);
            if (det === 0) {
                return false;
            } else {
                lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
            }
        };