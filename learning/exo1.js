const double = (nombre) => {
    return nombre*2
}

console.log(double(10))

const estGrand = (nombre) => {
    if (nombre >= 100) {
        return "grand"
    }
    else {
        return "petit"
    }
}
nombre = 101
console.log(`${nombre} est `+ estGrand(101))