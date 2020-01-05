class Queue {
    constructor() {
        this.list = [];
    }

    /**
     * @returns {int} 큐의 크기
     */
    get size() {
        return this.list.size;
    }

    /**
     * 큐에 객체를 넣는다.
     * @param {any} object 객체  
     */
    enqueue(object) {
        this.list.push(object);
    }

    /**
     * 큐로부터 객체를 꺼내온다.
     * @returns {any} 큐에 첫번째 객체
     */
    dequeue() {
        return this.list.pop();
    }
}

module.exports = Queue;