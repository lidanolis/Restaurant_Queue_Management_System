var restaurantTable = [];

export const QueueManagementController = async (
  restaurantId,
  socket,
  numberOfTimes
) => {
  if (socket) {
    socket.emit("homePageChange", {
      restaurantId: restaurantId,
      actionType: "staff",
    });
  }
  for (var i = 1; i <= numberOfTimes; i++) {
    console.log("loop turn-" + i);
    const response = await fetch(
      `http://localhost:8000/user/getARestaurant/${restaurantId}`
    ).catch((err) => {});
    const json = await response.json().catch((err) => {});

    if (response.ok) {
      restaurantTable = json.restaurantTable;
      const bookingResponse = await fetch(
        `http://localhost:8000/user/getBookings/${restaurantId}`
      ).catch((err) => {});
      const allBookings = await bookingResponse.json().catch((err) => {});

      if (allBookings.length !== 0) {
        var bestSmallerSeatName = "";
        var bestSmallerSeatNumber = 0;

        var bestBiggerSeatName = "";
        var bestBiggerSeatNumber = 0;

        var bestSeatName = "";
        var areTheBookingsValid = true;
        const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
        const fastForwardMinutes = 15;
        var currentDate = new Date();
        currentDate = new Date(
          currentDate.getTime() + fastForwardMinutes * 60 * 1000
        );
        var bookingDate = new Date(allBookings[0].BookedTime);
        bookingDate = new Date(bookingDate.getTime() - malaysiaTimeOffset);
        console.log("booking Time--->" + bookingDate);
        console.log("current Time is (fast forwarded)--->" + currentDate);

        const specificBooking = {
          _id: allBookings[0]._id,
          userId: allBookings[0].userId,
          restaurantId: allBookings[0].restaurantId,
          quantity: allBookings[0].quantity,
          status: allBookings[0].status,
          tableName: allBookings[0].tableName,
          BookedTime: allBookings[0].BookedTime,
        };
        for (var j = 1; j < allBookings.length; j++) {
          if (specificBooking.status === "Book") {
            var bookingDate = new Date(specificBooking.BookedTime);
            bookingDate = new Date(bookingDate.getTime() - malaysiaTimeOffset);
            if (bookingDate > currentDate) {
              specificBooking._id = allBookings[j]._id;
              specificBooking.userId = allBookings[j].userId;
              specificBooking.restaurantId = allBookings[j].restaurantId;
              specificBooking.quantity = allBookings[j].quantity;
              specificBooking.status = allBookings[j].status;
              specificBooking.tableName = allBookings[j].tableName;
              specificBooking.BookedTime = allBookings[j].BookedTime;
            } else {
              const findDuplicate = restaurantTable.find(
                (aTable) => aTable.userId === specificBooking.userId
              );
              var foundInOtherRestaurants = false;
              const seatingResponse = await fetch(
                `http://localhost:8000/user/checkRestaurantSeats/${specificBooking.userId}`
              );
              if (seatingResponse.ok) {
                foundInOtherRestaurants = true;
              } else {
                foundInOtherRestaurants = false;
              }

              if (findDuplicate || foundInOtherRestaurants) {
                console.log(
                  "Void Due To Having Booked Date Smaller Than Current Date"
                );
                const newBooking = {
                  userId: specificBooking.userId,
                  restaurantId: specificBooking.restaurantId,
                  quantity: specificBooking.quantity,
                  status: "Void",
                  tableName: "",
                  BookedTime: specificBooking.BookedTime,
                };
                const updateNewBooking = await fetch(
                  `http://localhost:8000/user/updateTable/${specificBooking._id}`,
                  {
                    method: "POST",
                    body: JSON.stringify(newBooking),
                    headers: { "Content-Type": "application/json" },
                  }
                );
                const json = await updateNewBooking.json();
                specificBooking._id = allBookings[j]._id;
                specificBooking.userId = allBookings[j].userId;
                specificBooking.restaurantId = allBookings[j].restaurantId;
                specificBooking.quantity = allBookings[j].quantity;
                specificBooking.status = allBookings[j].status;
                specificBooking.tableName = allBookings[j].tableName;
                specificBooking.BookedTime = allBookings[j].BookedTime;
              } else {
                break;
              }
            }
          } else {
            break;
          }
        }
        console.log(JSON.stringify(specificBooking));
        var bookingDate = new Date(specificBooking.BookedTime);
        bookingDate = new Date(bookingDate.getTime() - malaysiaTimeOffset);
        if (bookingDate > currentDate) {
          if (specificBooking.status === "Book") {
            areTheBookingsValid = false;
          }
        } else {
          var foundInOtherRestaurants = false;
          const seatingResponse = await fetch(
            `http://localhost:8000/user/checkRestaurantSeats/${specificBooking.userId}`
          );
          if (seatingResponse.ok) {
            foundInOtherRestaurants = true;
          } else {
            foundInOtherRestaurants = false;
          }
          const checkDuplicate = restaurantTable.find(
            (aTable) => aTable.userId === specificBooking.userId
          );
          if (checkDuplicate || foundInOtherRestaurants) {
            console.log(
              "Void Due To Having Booked Date Smaller Than Current Date As The Last Item"
            );
            const newBooking = {
              userId: specificBooking.userId,
              restaurantId: specificBooking.restaurantId,
              quantity: specificBooking.quantity,
              status: "Void",
              tableName: "",
              BookedTime: specificBooking.BookedTime,
            };
            const updateNewBooking = await fetch(
              `http://localhost:8000/user/updateTable/${specificBooking._id}`,
              {
                method: "POST",
                body: JSON.stringify(newBooking),
                headers: { "Content-Type": "application/json" },
              }
            );
            const json = await updateNewBooking.json();
            areTheBookingsValid = false;
          }
        }

        if (areTheBookingsValid) {
          restaurantTable.forEach((eachTable) => {
            if (eachTable.tableStatus == "available" && bestSeatName === "") {
              const seatChecking =
                eachTable.tableQuantity - specificBooking.quantity;
              if (seatChecking === 0) {
                bestSeatName = eachTable.tableName;
              } else if (
                bestSmallerSeatName === "" &&
                bestBiggerSeatName === ""
              ) {
                if (seatChecking > 0) {
                  bestBiggerSeatName = eachTable.tableName;
                  bestBiggerSeatNumber = seatChecking;
                } else {
                  bestSmallerSeatName = eachTable.tableName;
                  bestSmallerSeatNumber = seatChecking;
                }
              } else {
                if (seatChecking > 0) {
                  if (bestBiggerSeatName === "") {
                    bestBiggerSeatName = eachTable.tableName;
                    bestBiggerSeatNumber = seatChecking;
                  } else if (seatChecking < bestBiggerSeatNumber) {
                    bestBiggerSeatName = eachTable.tableName;
                    bestBiggerSeatNumber = seatChecking;
                  }
                } else {
                  if (bestSmallerSeatName === "") {
                    bestSmallerSeatName = eachTable.tableName;
                    bestSmallerSeatNumber = seatChecking;
                  } else if (seatChecking > bestSmallerSeatNumber) {
                    bestSmallerSeatName = eachTable.tableName;
                    bestSmallerSeatNumber = seatChecking;
                  }
                }
              }
            }
          });

          var haveSeat = false;
          if (
            bestBiggerSeatName === "" &&
            bestSmallerSeatName === "" &&
            bestSeatName === ""
          ) {
          } else {
            if (bestSeatName === "") {
              if (bestBiggerSeatName === "") {
                bestSeatName = bestSmallerSeatName;
                haveSeat = true;
              } else {
                bestSeatName = bestBiggerSeatName;
                haveSeat = true;
              }
            } else {
              haveSeat = true;
            }
          }

          if (haveSeat) {
            const foundObject = restaurantTable.find(
              (obj) => obj.tableName === bestSeatName
            );

            if (foundObject) {
              const updateTableInfo = {
                tableName: foundObject.tableName,
                tableQuantity: foundObject.tableQuantity,
                tableStatus: "occupied",
                userId: specificBooking.userId,
              };

              const manageRestaurantTables = await fetch(
                `http://localhost:8000/user/updateRestaurantTable/${restaurantId}`,
                {
                  method: "POST",
                  body: JSON.stringify(updateTableInfo),
                  headers: { "Content-Type": "application/json" },
                }
              );
              const updateTableJson = await manageRestaurantTables.json();
              if (!manageRestaurantTables.ok) {
              } else {
                const newBooking = {
                  userId: specificBooking.userId,
                  restaurantId: specificBooking.restaurantId,
                  quantity: specificBooking.quantity,
                  status: "Completed",
                  tableName: foundObject.tableName,
                  BookedTime: specificBooking.BookedTime,
                };
                const updateNewBooking = await fetch(
                  `http://localhost:8000/user/updateTable/${specificBooking._id}`,
                  {
                    method: "POST",
                    body: JSON.stringify(newBooking),
                    headers: { "Content-Type": "application/json" },
                  }
                );
                const json = await updateNewBooking.json();
                if (!updateNewBooking.ok) {
                } else {
                  if (socket) {
                    socket.emit("assignSeat", {
                      restaurantId: json.restaurantId,
                      userId: json.userId,
                      tableName: json.tableName,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
