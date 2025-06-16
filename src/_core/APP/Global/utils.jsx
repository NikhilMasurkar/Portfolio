export const downloadFileFromUrl = (uri, name, setLoading) => {
  setLoading(true);

  fetch(uri)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error("Download failed:", error);
    })
    .finally(() => {
      setLoading(false);
    });
};
