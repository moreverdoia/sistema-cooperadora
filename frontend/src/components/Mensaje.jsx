function Mensaje({ tipo = '', children }) {
  return (
    <section className={`mensaje ${tipo}`}>
      {children}
    </section>
  );
}

export default Mensaje;