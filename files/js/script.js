"use strict";
const docSubmit = document.getElementById("form_submit");
const docAttachment = document.getElementById("AttachmentFiles");
let count = 0;

function submitForm(e) {
    e.preventDefault();
    let files = docAttachment.files;
    console.log(files);
    console.log(files.length);

    [...files].forEach((file) => {
        const FR = new FileReader();
        FR.onload = (e) => {
            const data = e.target.result.split(",");
            const fileData = {
                fileName: file.name,
                mimeType: file.type,
                data: data[1],
            };
            google.script.run
                .withSuccessHandler((id) => {
                    count++;
                    if (count == files.length) {
                        docAttachment.value = "";
                        google.script.run.withSuccessHandler().importCSV();
                        google.script.host.close();
                    }
                })
                .withFailureHandler()
                .uploadFile(fileData);
        };
        FR.readAsDataURL(file);
    });
}
