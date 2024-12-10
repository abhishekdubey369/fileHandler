import * as fs from "fs/promises"; //using module type alternate require() statement could be used but anyway i prefer this
const fileArr = [] //you are free to use local storage or db for this go play with it 
async function createFile(fileName){
  try{
  const fileCheck = await fs.open(fileName,"r");
}catch(e){
  const fileCreate = await fs.open(fileName,"w");
}
}
(async ()=>{
  const watcher = fs.watch("./"); // returns {eventType , filename}
  //cool lets now open our file
  const file = await fs.open("./change.txt","r");
  /*
   * There is interesting concept of this how fs handles file and buffer concept
   * if you are not already famliar i highly recommend to read docs
   * lets use EventEmitter concept here as fs extend it*/

  file.on('change', async () => {
    const size = (await file.stat()).size; //getting size of file
    const buff = Buffer.alloc(size); // creating buffer with that size
    const offset = 0; //setting offset to zero to keep byteLength constant everytime
    const length = buff.byteLength; //Definig byteLength
    const position = 0; //setting position to 0 so that it always start from begining

    const content = await file.read(
      buff,
      offset,
      length,
      position
    );

    console.log(content);
  })

  file.on("deleted", async ()=>{
    console.log("file is deleted");
  })
  file.on("created", async ()=>{
    console.log("file is created")
  })
  /*
   * eventType === change if changes are made
   * eventType === rename if either make or delete of file is done*/
  //async iterator
  for await (const event of watcher){
    //main thing will go here
    if(event.eventType==="change" && event.filename === "change.txt"){
      //action
      file.emit('change');
    }else if(event.eventType==="rename"){
      if(fileArr.indexOf(event.filename)!=-1 && fileArr.indexOf(event.filename)!=null
      ){
        file.emit("deleted");
        console.log(event.eventType);
        console.log(event.filename);
        //fileArr.remove(event.filename);
      }else{
        fileArr.push(event.filename);
        console.log(event.eventType);
        file.emit("created");
        console.log(event.filename);
      }
    }
    //console.log(event);
  }
  console.log(a);
})();
