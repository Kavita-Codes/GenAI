 const cleanResumeText = (text) => {

    return text

        .replace(/\r/g, "")

        .replace(/\t/g, " ")

        .replace(/\n{2,}/g, "\n")

        .replace(/\s{2,}/g, " ")

        .trim()

        .substring(0, 15000);

};

export default cleanResumeText
