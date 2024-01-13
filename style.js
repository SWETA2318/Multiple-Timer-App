const timerForm = document.getElementById("set_timer_container");
const timerHead = document.getElementById("timer_container_head");
const timerContainer = document.getElementById("timers_container");
const audio = new Audio("alaram.mp3");

let timers ={} //timers object to contain multiple timer details

//Function for providing unique id to every timer.
function generateUniqueId(prefix = "id") {
    const timestamp = new Date().getTime();
    return `${prefix}_${timestamp}`;
}


//Adding event listener to timer form to add new timer.
timerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let hours = timerForm.hours.value;
    let minutes = timerForm.minutes.value;
    let seconds = timerForm.seconds.value;

    if(!validateTime(hours, minutes, seconds)) return; 

    //if one of hours, minutes or seconds are set then setting others as 0
    hours = hours ? hours : 0;
    minutes = minutes ? minutes : 0;
    seconds = seconds ? seconds : 0;

    if ((timerHead.style.display = "block")) timerHead.style.display ="none";


    const id = generateUniqueId();
    createNewTimer(hours, minutes, seconds, id);
    //creating new object of new timer.
    let newTimerObj = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        intervaLId: null,
    };

    //Adding new timer object to the timers object.
    timers[id] = newTimerObj;
//saving timers data in local storage.
    localStorage.setItem("timers", JSON.stringify(timers));

    //Starting timer.
    startTimer(id);

    timerForm.reset();
});

function createNewTimer(hours, minutes, seconds, id) {
    // creating new timer card.
    const NewTimer = document.createElement("div");
    newTimer.className = "timer_card";
    newTimer.id = id;
    newTimer.innerHTML = `<p>Timer Left :</p>
    <p class="remaining_time">${hours}h : ${minutes}m : "${seconds}s</p>
    `;
    //Adding delete button to tha timer card for delete the timer.
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "stop_btn";

    //Adding click event listener to the delete button.
    deleteBtn.addEventListener("click", () => deleteTimerCard(newTimer));


   //Appending delete button to the timer.
   newTimer.appendChild(deleteBtn);

   //Appending New Timer to the timers container.
   timersContainer.appendChild(newTimer);
}


//Function to check whether entered time is in correct format or not.
function validateTime(h, m, s) {
    if (h < 0 || m < 0 || m > 60 || s < 0 || s > 60 || (!h && !m && !s)) {
        alert("Enter valid time"); //If time is not correct then slow an alert message on screen.
        return false;
    }
    return true;
    }

    //Function to stop or delete timer.
    function deleteTimerCard(timer) {
        timer.remove(); //remove the timer card from the document.
        audio.pause();
        clearInterval(timers[timer.id].intervaLId); //clearing the interval.

        delete timers[timer.id]; //deleting timer data from the timers object.

        //saving modified data of timers object in local storage.
        localStorage.setItem("timers", JSON.stringify(timers));
        if (object.keys(timers).length === 0) timerHead.style.display = "block";
    }

//function to start new timer.
function startTimer(timerId) {
//setting interval for timer.
timers[timerId].intervalId = setInterval(() => updateTimer(timerId), 1000);
}
    //function to update timer.
    function updateTimer(timerId) {
        const timer = timers[timerId];
        

        if (timer.hours < 0) {
            clearInterval(timers[timerId].intervalid);
            showStopCard(timerId);
            return;
        }
        timer.seconds--;

        if (timer.seconds < 0) {
            //if seconds is less than 0 then set seconds to 59 and decrement minutes.
            timer.seconds = 59;
            timer.minutes--;
            if (timer.minutes < 0) {
                //if minutes is less than 0 then set seconds to 59 and decrement hours.
                timer.minutes = 59;
                timer.hours--;
                if(timer.hours < 0) {
                    //if hours is less than 0 then time is up and stoping the timer.

                    clearInterval(timers[timerId].intervalid);
                    showStopCard(timerId);
                    return;
                }
            }
        }
        localStorage.setItem("timers", JSON.stringify(timers));
        //updating timer on display.
        updateTimerDisplay(timerId);
    }
     //Function to change the appearance of timer card when it is stopped.
     function showStopCard(timerId) {
        const timer = document.getElementById(`${timerId}`);
        timer.innerHTML = `<h1>Timer Is Up !</h1>`;
        timer.classList.remove("timer_card");
        timer.className = "stop_card";


        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Stop";
        deleteBtn.className = "stop_btn";
        deleteBtn.addEventListener("click", () => deleteTimerCard(timer));


        timer.appendChild(deleteBtn);


      //playing alaram sound when timer is stopped.
        audio.play();
     }

     //function to update timer on display.
     function updateTimerDisplay(timerId) {
        const timer = timers[timerId];
        const formattedTime = `${timer.hours}h : ${timer.minutes}m : ${timer.seconds}$`;

        document.querySelector(`#{timerId}.remaing_time`).innerText = formattedTime;
     }


     //Adding event listener to the document, when it reloads if any timer is going on so that it will continue.
     document.addEventListener("DOMContentLoaded", () => {
        const extractedData = localStorage.getItem("timers");
        if (extractedData) {
            timers = JSON.parse(extractedData);
            if (object.keys(timers).length)timerHead.style.display = "none";
            for (let id in timers) {
                createNewTimer(
                    timers[id].hours,
                    timers[id].minutes,
                    timers[id].seconds,
                    id
                );
                startTimer(id);
             }
        }
    });
     