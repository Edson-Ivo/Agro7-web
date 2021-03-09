const getFormData = (form, initialData = {}) => {
  const dataForm = new FormData(form);
  let formData = initialData;

  for (const name of dataForm.keys()) {
    const input = form.elements[name];
    const key = input.name;
    const { value } = input;

    formData = { ...formData, [key]: value };
  }

  return formData;
};

export default getFormData;
