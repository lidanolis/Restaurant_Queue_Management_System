export const RestaurantNameLocatingController = async (restaurantId) => {
  const response = await fetch(
    `http://localhost:8000/staff/getRestaurant/${restaurantId}`
  ).catch((err) => {
    console.log("error here: " + err);
  });
  const json = await response.json().catch((err) => {
    console.log("error here instead: " + err);
  });

  if (response.ok) {
    return json.restaurantName;
  }
};
