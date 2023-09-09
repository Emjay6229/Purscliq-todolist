exports.formatDateToCustomFormat = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

exports.formatStringDateToCustomFormat = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

exports.compareDateAndChangeStatus = (start, end=undefined) => {
  const formattedCurrentDate = this.formatDateToCustomFormat();
  const startDate = this.formatStringDateToCustomFormat(start);

  let endDate;
  
  if(end !== undefined ) endDate = this.formatStringDateToCustomFormat(end);
  
  let status = "";

  if( startDate > formattedCurrentDate && (endDate >= startDate || !end)) {
    status = "pending";
  }
  else if(startDate === formattedCurrentDate && (endDate >= startDate || !end)) {
    status = "in progress";
  }
  else if(endDate < formattedCurrentDate) {
    status = "completed";
  };

  return status;
};