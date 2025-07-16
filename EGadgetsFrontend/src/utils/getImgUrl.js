function getImgUrl(name) {
    if (!name) return ""; // Prevents errors if productImage is null
    return `http://localhost:3000${name}`; // Ensures correct path
}



export { getImgUrl };
