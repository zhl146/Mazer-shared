"use strict";
import test from 'tape';
import BinaryHeap from '../src/BinaryHeap';

export default class BinaryHeapTest {
    constructor(){

    }

    binaryHeapConstructorTest(assert){
        let testFunction = function (point) {
            return point.f;
        }
        let BinaryHeap1 = new BinaryHeap(testFunction);
        assert.equal(BinaryHeap1.scoreFunction, testFunction);
        assert.end();
    }

    pushTest(assert){
        let points = []
        points.push({f:12});
        points.push({f:30});
        points.push({f:40});
        points.push({f:-5});
        points.push({f:50});
        let testFunction = function (point) {
            return point.f;
        }
        let BinaryHeap1 = new BinaryHeap(testFunction);
        
        // this is going to push all are points into the binary heap
        points.map(function(point){ BinaryHeap1.push(point) });

        // after the push our tree should look like:
        //                  -5
        //               /      \
        //              12      40
        //            /    \   
        //          30      50

        assert.equal(BinaryHeap1.content[0].f, -5);
        assert.equal(BinaryHeap1.content[1].f, 12);
        assert.equal(BinaryHeap1.content[2].f, 40);
        assert.equal(BinaryHeap1.content[3].f, 30);
        assert.equal(BinaryHeap1.content[4].f, 50);
        assert.end();
    }

    removeTest(assert){
        let points = []
        points.push({f:12});
        points.push({f:30});
        points.push({f:40});
        points.push({f:-5});
        points.push({f:50});
        let testFunction = function (point) {
            return point.f;
        }
        let BinaryHeap1 = new BinaryHeap(testFunction);
        
        // this is going to push all are points into the binary heap
        points.map(function(point){ BinaryHeap1.push(point) });

        // after the push our tree should look like:
        //                  -5
        //               /      \
        //              12      30
        //            /    \   
        //          40      50

        //unlike our push test, we'll now remove an element to force a re-order
        BinaryHeap1.remove(BinaryHeap1.content[1]);

        // our tree should now reorder and look like:
        //                  -5
        //               /      \
        //              30      40
        //            /       
        //          50
        
        assert.equal(BinaryHeap1.content[0].f, -5);
        assert.equal(BinaryHeap1.content[1].f, 30);
        assert.equal(BinaryHeap1.content[2].f, 40);
        assert.equal(BinaryHeap1.content[3].f, 50);
        assert.end();
    }
    
    

    runTests(){
        test('testing the constructor for binary heap', this.binaryHeapConstructorTest);
        test('test the addition of new nodes to the heap', this.pushTest);
        test('test the removal of nodes from the heap', this.removeTest);
    }
}