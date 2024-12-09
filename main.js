import * as fs from "fs/promises"; //using module type alternate require() statement could be used but anyway i prefer this

(async ()=>{
  const watcher = fs.watch("./change.txt"); // returns {eventType , filename}
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

  /*
   * eventType === change if changes are made
   * eventType === rename if either make or delete of file is done*/
  //async iterator
  for await (const event of watcher){
    //main thing will go here
    if(event.eventType==="change" && event.filename === "change.txt"){
      //action
      file.emit('change');
    }
    //console.log(event);
  }
  console.log(a);
})();
