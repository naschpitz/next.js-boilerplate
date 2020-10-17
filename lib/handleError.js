export default function handleError(req, res, error) {
  let message = "";

  const errors = error.errors;

  if (errors) {
    Object.keys(errors).forEach((key) => {
      message = errors[key].properties.message + " ";
    });

    return res.status(400).json({ message: message });
  }

  else
    return res.status(500).json({ message: error.message });
}