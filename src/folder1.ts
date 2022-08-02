type File = {
  type: "file",
  name: string,
  value: number
};

type Folder = {
  type: "folder",
  name: string,
  entries: Array<FolderEntry>;
};

type FolderEntry = File | Folder;

// Constructors
export const file = (name: string, value: number): File => ({ type: "file", name, value });
export const folder = (name: string, entries: Array<FolderEntry> = []): Folder => ({ type: "folder", name, entries });


// typeguards
export const isFile = (entry: FolderEntry): entry is File => entry.type === "file";
export const isFolder = (entry: FolderEntry): entry is Folder => entry.type === "folder";


const f = folder(
  "root",
  [
    file("five.txt", 5),
    file("six.txt", 6),
    folder("var", [
      file("lib.dll", 6789)
    ])
  ]
);


export const logFile = ({name, value}: File) => console.log(`${name}: ${value}`);
export const logFolder = ({name, entries}: Folder, indent: number = 0) => {
  console.log(`${'-'.repeat(indent)}+ ${name}:`);
  entries.forEach((e) => {
    if (isFile(e)) logFile(e);
  });

  entries.forEach((e) => {
    if (isFolder(e)) logFolder(e, indent+4);
  });
}

logFolder(f);




export {};
