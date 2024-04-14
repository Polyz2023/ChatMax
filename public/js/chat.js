var isOTVET=true;
var otsv="" ;
        function otvet(e) {
            console.log(e.textContent);
            var sob = document.getElementById('soob');
            sob.innerText = `Ответ → ` + `${e.textContent}`;
            isOTVET = false;
            otsv = e.textContent.trim(); // Обновление переменной otsv с текстом оригинального сообщения
            console.log(otsv, isOTVET);
        }

       $(function(){
            var socket = io();
            var $form = $('#messForm');
            var $textarea = $('#message');
            var $name = $('#name');
            var $all_messages = $('#all_mess');
            var $oni = $('#oni');
            var $file = $('#file');
            var $fname = $("#fname");
            let hours;
            let minutes;// Определение переменных в глобальной области видимост

            $fname.submit(function(ev){
                ev.preventDefault();
                document.getElementById("main").style.display="block";
                document.getElementById("login").style.display="none";
            });

            $form.submit(function(event) {
                event.preventDefault();
                const now = new Date();
                hours = now.getHours();
                minutes = now.getMinutes();
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;

                if (isOTVET) {
                    socket.emit('send mess', {
                        mess: $textarea.val(),
                        name: $name.val(),
                        hours: hours,
                        minutes: minutes
                    });
                } else {
                    console.log("Ответ на:", otsv); // Добавьте эту строку для отладки
                    socket.emit('sendo mess', {
                        mess: $textarea.val(),
                        name: $name.val(),
                        hours: hours,
                        minutes: minutes,
                        o: otsv
                    });
                }

                $textarea.val('');
            });

            $(document).keydown(function(event){
        // Проверяем, нажата ли клавиша Enter (код клавиши 13) и активен ли элемент с id "message"
                if (event.keyCode === 13 && event.target.id === 'message') {
                    event.preventDefault();
                    const now = new Date(); // Получаем текущее время
                    hours = now.getHours(); // Получаем часы
                    minutes = now.getMinutes(); // Получаем минуты
                    hours = hours < 10 ? '0' + hours : hours; // Добавляем ноль перед часами, если это нужно
                    minutes = minutes < 10 ? '0' + minutes : minutes; // Добавляем ноль перед минутами, если это нужно

                    if(isOTVET){
                        socket.emit('send mess', {
                            mess: $textarea.val(), 
                            name: $name.val(), 
                            hours: hours, 
                            minutes: minutes
                        });
                    }else{
                        socket.emit('sendo mess', {
                            mess: $textarea.val(), 
                            name: $name.val(), 
                            hours: hours, 
                            minutes: minutes,
                            o: otsv
                        });
                    }

                    $textarea.val('');
                }
            });

            socket.on('add mess', (data) => {
                console.log("Received message on client:", data);
                let now = new Date(); // Получаем текущее время
                let hours = now.getHours(); // Получаем часы
                let minutes = now.getMinutes(); // Получаем минуты
                hours = hours < 10 ? '0' + hours : hours; // Добавляем ноль перед часами, если это нужно
                minutes = minutes < 10 ? '0' + minutes : minutes; // Добавляем ноль перед минутами, если это нужно
                
                // Отображаем обычные сообщения
                if (data.name === $name.val()) {
        // Если сообщение от текущего пользователя, добавляем класс "my-message"
                    $all_messages.append("<div onclick='otvet(this)' style='width:100%' class='alert alert-dark my-message'><b>"+ data.name+ " (" + hours + ":" + minutes + "): " +"</b>" + data.msg +"</div>");
                } else {
                    // Если сообщение от другого пользователя, не добавляем класс
                    $all_messages.append("<div onclick='otvet(this)' style='width:100%'  class='alert alert-dark'><b>"+ data.name+ " (" + hours + ":" + minutes + "): " +"</b>" + data.msg +"</div>");
                }

                $all_messages.scrollTop($all_messages[0].scrollHeight);
            });

            socket.on('adds mess', (data) => {
                if(data.name===$name.val()){
                    $all_messages.append(`<div onclick='otvet(this)' style='width:100%'  class='alert alert-dark  my-message' ><i>Ответ → '${data.o}'→ </i><b>${data.name} (${data.hours}:${data.minutes}): ${data.msg}</b></div>`);
                } else{
                    $all_messages.append(`<div onclick='otvet(this)' style='width:100%'  class='alert alert-dark' ><i>Ответ → '${data.o}'→ </i><b>${data.name} (${data.hours}:${data.minutes}): ${data.msg}</b></div>`);
                }
                $all_messages.scrollTop($all_messages[0].scrollHeight);
                isOTVET = true;
                document.getElementById('soob').innerText = "Сообщение";
            });


            socket.on('onu', (data)=>{
                $oni.text("Онлайн людей в чате: " + data);
            });

            document.getElementById('file').addEventListener('change', function(event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    var base64 = e.target.result;
                    socket.emit('send image', {image: base64, name: $name.val()});
                };
                
                reader.readAsDataURL(file);
            });

            socket.on('add image', (data) => {
                console.log("Received image on client:", data);
                let now = new Date(); // Получаем текущее время
                let hours = now.getHours(); // Получаем часы
                let minutes = now.getMinutes(); // Получаем минуты
                hours = hours < 10 ? '0' + hours : hours; // Добавляем ноль перед часами, если это нужно
                minutes = minutes < 10 ? '0' + minutes : minutes;
                if(data.name===$name.val()){
                    $all_messages.append(`<div class='alert alert-dark  my-message'><b>${data.name}(${hours}:${minutes}):</b> <img src="${data.image}" class='ai' style="max-width:200px;"></div>`);
                }
                else{
                    $all_messages.append(`<div class='alert alert-dark'><b>${data.name}(${hours}:${minutes}):</b> <img src="${data.image}" class='ai' style="max-width:200px;"></div>`);
                }
                $all_messages.scrollTop($all_messages[0].scrollHeight);
            });

        });
