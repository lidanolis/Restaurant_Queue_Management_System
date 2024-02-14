export const StaffStatusCheckingController = async (userId) => {
  const response = await fetch(`http://localhost:8000/profile/${userId}`).catch(
    (err) => {
      console.log("error here: " + err);
    }
  );
  const json = await response.json().catch((err) => {
    console.log("error here instead: " + err);
  });

  if (response.ok) {
    return json.inOut;
  }
};
