var restaurantTable = [];

export const QueueManagementController = async (
  restaurantId,
  socket,
  numberOfTimes
) => {
  console.log(
    "-----------------------------------------------number of times: " +
      numberOfTimes
  );
  for (var i = 1; i <= numberOfTimes; i++) {
    console.log("restaurant name: " + restaurantId);

    const response = await fetch(
      `http://localhost:8000/user/getARestaurant/${restaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      restaurantTable = json.restaurantTable;
      console.log("restaurant tables: " + JSON.stringify(json.restaurantTable));
      const bookingResponse = await fetch(
        `http://localhost:8000/user/getBookings/${restaurantId}`
      ).catch((err) => {
        console.log("error here: " + err);
      });
      const allBookings = await bookingResponse.json().catch((err) => {
        console.log("error here instead: " + err);
      });

      console.log("booking size: " + allBookings.length);
      if (allBookings.length !== 0) {
        var bestSmallerSeatName = "";
        var bestSmallerSeatNumber = 0;

        var bestBiggerSeatName = "";
        var bestBiggerSeatNumber = 0;

        var bestSeatName = "";

        restaurantTable.forEach((eachTable) => {
          if (eachTable.tableStatus == "available") {
            console.log("table available-" + eachTable.tableName);
            const seatChecking =
              eachTable.tableQuantity - allBookings[0].quantity;
            console.log("seatChecking-" + seatChecking);
            console.log("seatCheckingWith-" + eachTable.tableQuantity);
            console.log("seatCheckingTo-" + allBookings[0].quantity);
            if (seatChecking === 0) {
              console.log("here-" + eachTable.tableName);
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
          console.log("no seat Available Currently");
        } else {
          console.log("bigger seat available:" + bestBiggerSeatName);
          console.log("smaller seat available:" + bestSmallerSeatName);
          console.log("best seat available:" + bestSeatName);
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
          console.log("table Most Suited:" + bestSeatName);
          const foundObject = restaurantTable.find(
            (obj) => obj.tableName === bestSeatName
          );

          if (foundObject) {
            console.log("the best Table is:" + foundObject.tableName);
            console.log("the quantity is:" + foundObject.tableQuantity);
            console.log("the status is:" + foundObject.tableStatus);

            const updateTableInfo = {
              tableName: foundObject.tableName,
              tableQuantity: foundObject.tableQuantity,
              tableStatus: "occupied",
              userId: allBookings[0].userId,
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
              console.log("Invalid Credentials");
            } else {
              console.log(`Restaurant Tables Updated`);
              const newBooking = {
                userId: allBookings[0].userId,
                restaurantId: allBookings[0].restaurantId,
                quantity: allBookings[0].quantity,
                status: "Completed",
                tableName: foundObject.tableName,
                BookedTime: allBookings[0].BookedTime,
              };
              const updateNewBooking = await fetch(
                `http://localhost:8000/user/updateTable/${allBookings[0]._id}`,
                {
                  method: "POST",
                  body: JSON.stringify(newBooking),
                  headers: { "Content-Type": "application/json" },
                }
              );
              const json = await updateNewBooking.json();
              if (!updateNewBooking.ok) {
                console.log("Invalid Credentials");
              } else {
                console.log("Booking Updated");
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
};
