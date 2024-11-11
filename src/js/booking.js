document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const startTimeSelect = document.getElementById("time-start");
    const endTimeSelect = document.getElementById("time-end");
    const dateInput = document.getElementById("date");
    const locationSelect = document.getElementById("location");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const reservationData = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            notes: document.getElementById("notes").value,
            location: locationSelect.value,
            date: dateInput.value,
            timeStart: startTimeSelect.value,
            timeEnd: endTimeSelect.value,
            persons: parseInt(document.getElementById("persons").value)
        };

        try {
            const isAvailable = await checkAvailability(reservationData);
            if (isAvailable) {
                await submitReservation(reservationData);
                alert("Reservation successfully submitted!");
                form.reset();
            } else {
                alert("Sorry, the selected time is already booked. Please choose another time.");
            }
        } catch (error) {
            alert("Error submitting reservation. Please try again.");
            console.error("Error:", error);
        }
    });

    async function submitReservation(data) {
        const response = await fetch("http://localhost:4000/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to submit reservation");
        }

        const result = await response.json();
        console.log("Reservation result:", result);
        getReservations();
    }

    async function checkAvailability(data) {
        const response = await fetch(`http://localhost:4000/reservations?date=${data.date}&location=${data.location}`);
        const reservations = await response.json();

        for (let reservation of reservations) {
            if (
                (data.timeStart >= reservation.timeStart && data.timeStart < reservation.timeEnd) ||
                (data.timeEnd > reservation.timeStart && data.timeEnd <= reservation.timeEnd) ||
                (data.timeStart <= reservation.timeStart && data.timeEnd >= reservation.timeEnd)
            ) {
                return false;
            }
        }
        return true;
    }

    async function getReservations() {
        const response = await fetch("http://localhost:4000/reservations");
        const reservations = await response.json();
        console.log("Existing reservations:", reservations);
    }

    async function loadReservations() {
        const response = await fetch("http://localhost:4000/reservations");
        const reservations = await response.json();
        updateAvailableTimeSlots(reservations);
    }

    function updateAvailableTimeSlots(reservations) {
        const selectedDate = dateInput.value;
        const selectedLocation = locationSelect.value;

        [...startTimeSelect.options].forEach(option => option.disabled = false);
        [...endTimeSelect.options].forEach(option => option.disabled = false);

        const filteredReservations = reservations.filter(reservation => 
            reservation.date === selectedDate && reservation.location === selectedLocation
        );

        filteredReservations.forEach(reservation => {
            [...startTimeSelect.options].forEach(option => {
                if (option.value >= reservation.timeStart && option.value < reservation.timeEnd) {
                    option.disabled = true;
                }
            });

            [...endTimeSelect.options].forEach(option => {
                if (option.value > reservation.timeStart && option.value <= reservation.timeEnd) {
                    option.disabled = true;
                }
            });
        });
    }

    dateInput.addEventListener("change", loadReservations);
    locationSelect.addEventListener("change", loadReservations);

    getReservations();
    loadReservations();
});
