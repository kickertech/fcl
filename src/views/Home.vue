<template>
  <md-card>
    <md-card-content class="home-content">
      <h1>Foosball Clicker</h1>
      <p>
        Statistiken braucht der Sport. Der Clicker nimmt Daten bei Ballbesitz
        und zeigt Statistiken über den Spielverlauf an.
      </p>
      <p>
        <b>Voraussetzung:</b> Momentan funktioniert der Clicker über den Browser Chrome 
      </p>
      <p>
        <b>Anwendung:</b> Durch Klicken werden Ballbesitze auf einer Stange und andere statische Ereignisse (Tore und Ausball/Toter Ball) vom Anwender geklickt. Ereignisse sind: Für beide Seiten/Teams Tor, Abwehr, Mittelfeld, Sturm, Timeout und Aus-Ball bzw. Toter Ball oder Stopp-Call.

Ballbesitz bedeutet Ballkontrolle, also Ballbesitz oder kontrollierter Schuss. Ein Ereignis ist z.B.: 3er-Schuss von Team 1, verschossen und erneuter Ballbesitz auf der 3er-Reihe, entspräche der Ereignisfolge "Offense" und "Offense". Später in der Statistik ist das z.B. ein Schuss ohne Torerfolg. Fliegende Bälle ohne Ballkontrolle werden nicht geklickt, erst wieder das nächste statische Ereignis.

Gerne testen mit einem gestreamten Spiel -- oder vielleicht auch zum Training zum Zählen von Quoten!?
      </p>
    </md-card-content>
  </md-card>
</template>

<style lang="scss">
.home-content {
  min-height: 700px;
}
</style>

<script>
export default {
  name: "Home",
  components: {}
};
</script>
