export { fetchJSON };

async function fetchJSON(file) {

    let res =  await fetch(file).then((r)=> r.json());  
    return res

}