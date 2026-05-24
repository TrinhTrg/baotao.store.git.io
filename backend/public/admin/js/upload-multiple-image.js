const uploadImageMultipleWrappers = document.querySelectorAll("[upload-image-multiple]");

if (uploadImageMultipleWrappers.length) {
  uploadImageMultipleWrappers.forEach((wrapper) => {
    const uploadImageInput = wrapper.querySelector("[upload-image-input]");
    const imagePreviewContainer = wrapper.querySelector(".image-preview-container");

    if (!uploadImageInput || !imagePreviewContainer) return;

    let selectedFiles = [];

    const syncInputFiles = () => {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach((file) => dataTransfer.items.add(file));
      uploadImageInput.files = dataTransfer.files;
    };

    const renderPreviews = () => {
      imagePreviewContainer.innerHTML = "";

      if (selectedFiles.length === 0) {
        return;
      }

      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewItem = document.createElement("div");
          previewItem.className = "multi-image-preview-item";

          // Image thumbnail
          const img = document.createElement("img");
          img.src = event.target.result;
          img.className = "multi-image-thumbnail";
          img.alt = `Image ${index + 1}`;

          // Index number badge
          const indexBadge = document.createElement("span");
          indexBadge.className = "image-index-badge";
          indexBadge.textContent = index + 1;

          // Main badge (only for first image)
          if (index === 0) {
            const mainBadge = document.createElement("span");
            mainBadge.className = "image-main-badge";
            mainBadge.textContent = "Main";
            previewItem.appendChild(mainBadge);
          }

          // Remove button
          const removeButton = document.createElement("button");
          removeButton.className = "multi-image-remove-btn";
          removeButton.innerHTML = "&times;";
          removeButton.type = "button";
          removeButton.title = "Remove image";
          removeButton.addEventListener("click", () => {
            selectedFiles.splice(index, 1);
            syncInputFiles();
            renderPreviews();
          });

          previewItem.appendChild(img);
          previewItem.appendChild(indexBadge);
          previewItem.appendChild(removeButton);
          imagePreviewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      });
    };

    uploadImageInput.addEventListener("change", (e) => {
      selectedFiles = Array.from(e.target.files);
      renderPreviews();
    });
  });
}
