import axios from 'axios';

const requestHandler = async (request, page) => {
  const result = await axios.get(
    `https://pixabay.com/api/?key=20439634-6c644a175487626659667f77f&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return result;
};

export { requestHandler };
