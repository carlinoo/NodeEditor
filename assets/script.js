String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


jQuery(document).keydown(function (event) {
    if ((event.ctrlKey || event.metaKey) && event.which == 83) {
        saveCode(active_file);
        event.preventDefault();
        return false;
    } else if ((event.ctrlKey || event.metaKey) && event.which == 82) {
        runCode(active_file);
        event.preventDefault();
        return false;
    }
});



function saveCode(file, noColor = false) {
    if (!noColor) {
        $('#saveButton').css('color', '#28a745');
        $('#saveButton').css('font-weight', '500');

        setTimeout(() => {
            $('#saveButton').css('color', 'rgba(0,0,0,0.5)');
            $('#saveButton').css('font-weight', '400');
        }, 300);
    }

    $.ajax({
        type: "POST",
        url: `/file/${file}`,
        data: JSON.stringify({
            data: editor.getValue()
        }),
        success: (data) => {
            console.log(data);
            $(`span[data-file="${file}"]`).html('');
        },
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
    });
    

    console.log('saving...');
}



function runCode(file) {
    $('#runButton').css('color', '#28a745');
    $('#runButton').css('font-weight', '500');

    setTimeout(() => {
        $('#runButton').css('color', 'rgba(0,0,0,0.5)');
        $('#runButton').css('font-weight', '400');
    }, 300);

    saveCode(file, true);

    $.ajax({
        type: "POST",
        url: `/file/${file}/run`,
        data: {},
        success: (data) => {
            let command = "";
            data.stdout.split('').forEach(e => {
                if (e.charCodeAt(0) == 10) {
                    term.write(command);
                    term.write('\n\r');
                    command = "";
                } else {
                    command += e;
                }
            });
            
            
            console.log(data);
        },
        dataType: 'json'
    });
    
    console.log('running...');
}



function getCode(file) {
    $.ajax({
        type: "GET",
        url: `/file/${file}`,
        data: {},
        success: (data) => {
            editor.setValue(data.file);
            $(`span[data-file="${active_file}"]`).html('');
            active_file = file;

            // Delete active tab on the current one
            $(`span[data-file="${file}"]`).html('');
            $('.list-group-item.active').removeClass('active');
            $(`.list-group-item[data-file="${file}"]`).addClass('active');
        },
        dataType: 'json'
    });
}



function getFiles() {
    $('#files_group').html(' ');

    $.ajax({
        type: "GET",
        url: `/files`,
        data: {},
        success: (data) => {

            files = data.files.split('\n');

            if (active_file == "") {
                active_file = files[0];
            }

            files.forEach(el => {
                let element = el.replace('files/', '');
                
                console.log(element)
                if (element == "undefined" || element == "") {
                    return;
                }

                
                $('#files_group').append(`
                    <a href="#" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action ${ active_file == element ? 'active' : ''}" data-file="${element}" onclick="getCode('${element}')">${element}<span data-file="${element}" class="badge badge-primary badge-pill"></span></a>
                `);
            });
        },
        dataType: 'json'
    });
}


function createFile() {
    let file_name = prompt("File name");

    if (!file_name) {
        return;
    }

    active_file = file_name;

    editor.setValue('// ' + file_name);

    $('#files_group').append(`
                    <a href="#" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action ${ active_file == file_name ? 'active' : ''}" data-file="${file_name}" onclick="getCode('${file_name}')">${file_name}<span data-file="${file_name}" class="badge badge-primary badge-pill">Unsaved</span></a>
                `);
}





function deleteFile() {
    let file_name = prompt("File name to delete", active_file);

    if (!file_name) {
        return;
    }

    $.ajax({
        type: "DELETE",
        url: `/file/${file_name}`,
        success: (data) => {
            console.log(data);
            active_file = "";
            getFiles();
        },
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
    });
}
