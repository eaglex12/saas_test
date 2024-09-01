export const formatDate = (date: Date | string) => {
	if (typeof date === "string") {
		date = new Date(date);
	}
	return date.toLocaleDateString(); // You can adjust the format as needed
};
