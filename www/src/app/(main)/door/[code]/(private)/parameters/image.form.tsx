//

import { FileTrigger } from "@1/ui/components";
import { Button } from "@1/ui/components/ButtonV";
import { useState } from "react";

//

const ACCEPTED_FILE_TYPES = ["image/png"];

export function Image_Form_Upload() {
  let [file, setFile] = useState<string[]>([]);
  const onChange = (e: FileList | null) => {
    if (!e) return;
    let files = Array.from(e);
    let urls = files.map((file) => file.name);
    setFile(urls);
  };
  console.log({ file });
  return (
    <FileTrigger acceptedFileTypes={ACCEPTED_FILE_TYPES} onChange={onChange}>
      <Button>Select a file</Button>
    </FileTrigger>
  );
}
