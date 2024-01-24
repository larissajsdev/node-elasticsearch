module.exports= {
  getEditionType: (filename)=>{
    switch (filename) {
      case "TE":
        return "Terceiros"
      case "EX":
        return "Executivo"
      case "JU":
        return "Judiciário"
      default:
        break;
    }
  }
}