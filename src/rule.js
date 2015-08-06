export default function rule (fact, message) {
    return (val) => {
        const isValid = fact(val);
        return { isValid, message };
    };
}