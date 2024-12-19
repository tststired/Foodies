
const ConvertBase64 = async (file) => {

  console.log(file)
  const base64Image = await convertBase64(file)
  
  function convertBase64(file) {
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = () => {
              resolve(fileReader.result);
          }

          fileReader.onerror = (error) => {
              reject(error);
          }
      })
  }
  return base64Image
}

export default ConvertBase64;