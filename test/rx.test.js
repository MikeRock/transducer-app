import Rx from 'rxjs'
import {expect} from 'chai'
import events from 'events'

describe('RxJS', () => {
    it('should be declared',() => {
     expect(Rx).to.exist  
    })
    it('should generate values from range',(done) => {
       const o =  Rx.Observable.range(1,5)
       const arr = []
        o.subscribe({
        next: v => {
        arr.push(v)
        },
        error: (e) => {
            console.error(e)
        },
        complete: () => {
            expect(arr).to.have.members([1,2,3,4,5])
            done()
        }})
    })
    it('should generate values from array',(done) => {
        const o =  Rx.Observable.from([1,2,3,4,5])
        const arr = []
         o.subscribe({
         next: v => {
         arr.push(v)
         },
         error: (e) => {
             console.error(e)
         },
         complete: () => {
             expect(arr).to.have.members([1,2,3,4,5])
             done()
         }})
    })
    it('should generate filtered values from array',(done) => {
        const o =  Rx.Observable.from([1,2,3,4,5]).filter((item) => item !==5)
        const arr = []
        o.subscribe({
        next: v => {
        arr.push(v)
        },
        error: (e) => {
            console.error(e)
        },
        complete: () => {
            expect(arr).to.not.have.members([5])
            done()
        }})
    })
    it('should generate values on event',(done) => {
        const MESSAGE = 'MESSAGE'
        const emitter = new events.EventEmitter()
        const o =  Rx.Observable.fromEvent(emitter,'click')
        o.subscribe((str) => {expect(str).to.be.a('string').and.contain(MESSAGE); done()})
        emitter.emit('click',MESSAGE)
    })
    it('should accumulate values',(done) => {
        const o =  Rx.Observable.from([1,2,3,4]).scan((acc) => acc + 1,0)
        let count = 0;
        o.subscribe(val => {if(count === 3) {expect(val).to.equal(4); done()} count++})
    })
    it('should subscribe to multiple observers variant #1',(done) => {
        const o =  Rx.Observable.from([1,2,3,4]).scan(count => 1,0)
        const subject = new Rx.Subject()
        let acc = 0
        let count = 1
        subject.subscribe(val => {acc+=val; count++})
        subject.subscribe(val => {acc-=val; if(count === 4) {expect(acc).to.equal(0); done()}})
        o.subscribe(subject)   
    })
    it('should subscribe to multiple observers variant #2',(done) => {
        const o =  Rx.Observable.from([1,2,3,4]).scan(count => 1,0)
        const subject = new Rx.Subject()
        let acc = 0
        let count = 1
        subject.subscribe(val => {acc+=val; count++})
        subject.subscribe(val => {acc-=val; if(count === 4) {expect(acc).to.equal(0); done()}})
        const multicast = o.multicast(subject)
        multicast.connect()
    })
    it('should manually emitt values to subject',(done) => {
        const subject = new Rx.Subject()
        subject.next(1)
        subject.subscribe(val => {expect(val).to.equal(2); done()})
        subject.next(2)
    })
    it('should timeout',(done) => {
        const subject = new Rx.Subject()
        subject.next(1)
        const sub = subject.subscribe(val => {sub.unsubscribe(); expect().to.throw; done()})
        subject.next(2)
    })
    it('Observable should buffer values until another triggers it after 100ms',(done) => {
       const emitter = new events.EventEmitter()
       const ob = Rx.Observable.fromEvent(emitter,'click')
       const ob2 =Rx.Observable.interval(50).scan((count) => count+1,0)
       const result = ob2.buffer(ob) 
       const subscribtion = result.subscribe((val) => {expect(val).to.be.an('array').which.property('length').not.equals(-1); done()})
       setTimeout(() => {emitter.emit('click')},100)
       setTimeout(() => {subscribtion.unsubscribe()},200)
    })
    it('Subject should return latest stored value after subscriber attaches',(done) => {
      const sub = new Rx.BehaviorSubject(1) // default value is 1
      sub.next(1)
      sub.next(2)
      sub.subscribe((val) => {expect(val).to.equal(2); done()})
      sub.next(3)
      sub.complete()
     })
     it('Subject should buffer previous values after subscriber attaches',(done) => {
        const sub = new Rx.ReplaySubject(4) // how many values to keep in buffer
        sub.next(5)
        sub.next(4)
        sub.next(3)
        sub.next(2)
        sub.subscribe((val) => {expect(val).to.equal(5); done()})
        sub.next(1)
        sub.complete()
       })
       it('Subject should buffer only last value after subscriber completes',(done) => {
        const sub = new Rx.AsyncSubject()
        sub.next(5)
        sub.subscribe((val) => {expect(val).to.equal(3)})
        sub.next(4)
        sub.subscribe((val) => {expect(val).to.equal(3); done()})
        sub.next(3)
        sub.complete()
       })
       it('a new instance of Observable should be created on Observer subscription',(done) => {
        const emitter = new events.EventEmitter()
        const ob = Rx.Observable.defer(() => Rx.Observable.fromEvent(emitter,'click').scan((acc,event) => acc,0))
        ob.subscribe((val) => {})
        emitter.emit('click')
        ob.subscribe((val) => {expect(val).to.equal(0);done()})
        emitter.emit('click')
       })
       it('an instance of Observable should return the same value',(done) => {
       const ob = Rx.Observable.interval(10).take(5).mapTo('Hi')
       const arr = []
       ob.subscribe(x=>{arr.push(x)},err=>{},()=>{expect(arr.reduce((count,x)=>{
        x === 'Hi' ? count++:count; return count
       },0)).to.equal(5);done()})
       })
       it('an instance of Observable should buffer another one',(done) => {
            const ob = Rx.Observable.interval(10).buffer(Rx.Observable.interval(20).take(2))
            ob.subscribe((arr)=>expect(arr).to.be.a('array'), err=>{}, ()=>{done()})
        })
        it('an instance of Observable should buffer be bufferd at a fixed interval',(done) => {
            const ob = Rx.Observable.interval(10).bufferTime(100).take(1)
            let count = 0
            ob.subscribe((arr)=>{
                expect(arr).to.be.a('array')
                expect(arr.length).to.be.gte(8)
                count++
            }, err=>{}, ()=>{expect(count).to.equal(1);done()})
        })
        it('an instance of Observable that buffers last 2 values on every emit',(done) => {
           const ob = Rx.Observable.interval(10).bufferCount(2,1).take(2)
           ob.subscribe(([prev,curr])=>{expect(curr-1).to.equal(prev)},err => {}, () => done())
        })
        it('an instance of Observable that buffers values',(done) => {
            const ob = Rx.Observable.empty().delay(30).buffer(Rx.Observable.interval(20).take(1))
            ob.subscribe((val)=>{expect(val).to.be.an('array').and.have.lengthOf(0);done()})  
         })
         it('an instance of Observable that takes values until a value is not reached',(done) => {
             // complete stream when counter reaches 2
            const ob = Rx.Observable.interval(10)
            ob.takeUntil(ob.filter((v) => v===2)).subscribe((val)=>{expect(val).to.be.oneOf([0,1])},err=>{},()=>{done()}) 
         })
         it('an instance of Observable that takes values until a value is not reached',(done) => {
            // complete stream when counter reaches 2
           const ob = Rx.Observable.interval(10)
           ob.takeUntil(ob.map(v => v===2 ? Rx.Observable.of(1) : Rx.Observable.empty() ).mergeAll()).subscribe((val)=>{expect(val).to.be.oneOf([0,1])},err=>{},()=>{done()}) 
        })
        it('an instance of Observable that takes a string and extracts its chars',(done) => {
           const ob = Rx.Observable.from('abc')
           ob.subscribe(v => {expect(v).to.be.oneOf(['a','b','c'])},err => {},() => {done()})
        })
        it('an instance of Observable that gets Converted to ConnectableObservable',(done) => {
         const ob = Rx.Observable.interval(10).take(1).publish()
         ob.subscribe((v) => {expect(v).to.exist})
         ob.subscribe((v) => {expect(v).to.exist; done()})
         ob.connect()
        })
        it('should combine iterables',(done) => {
           Rx.Observable.combineLatest(Rx.Observable.from([1,2]),Rx.Observable.from('ab'),(a,b)=>a+b)
           .subscribe(v=>{expect(v).to.be.oneOf(['2a','2b'])},err=>{}, ()=>{done()})
        })
        it('should reset when subscribing to more than one subscriber',(done) => {
            // observable will emit once more on any subsequent subscribtion
           const ob = Rx.Observable.interval(10).take(5)
           ob.subscribe(v => {expect(v).to.be.oneOf([0,1,2,3,4])},err=>{},()=>{})
           setTimeout(() => { ob.subscribe(v => {expect(v).to.be.oneOf([0,1,2,3,4])},err=>{},()=>{done()})},10)
         })
         it('should reset when subscribing to more than one subscriber',() => {
           const ob = Rx.Observable.create(ob => {
            ob.next(1)
            ob.complete()
           })
           ob.subscribe((val) => {expect(val).to.equal(1)})
         })
})
