class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        if (sub && sub.updata) {
            this.subs.push(sub)
        }
    }

    notify() {
        this.subs.forEach(sub => {
            sub.updata()
        })
    }
}