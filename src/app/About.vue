<template>
  <b-modal size="lg" hide-header hide-footer :visible="visible" @change="$emit('close')">
    <div style="width: 200px" class="mx-auto mb-3">
      <Logo />
    </div>
    <div class="m-2 small">
      <p>
        Σε μία κοινωνία που τα πάντα αποτελούν εμπόρευμα, από τις πρώτες και βασικές μας ανάγκες μέχρι τις τελευταίες και πιο δευτερεύουσες επιθυμίες μας, κάθε αγαθό είτε υλίκο είτε άυλο έχει την τιμή του, όπως οι ραδιοσυχνότητες, ο ήχος και η μουσική. Έναντια, λοιπόν, σε αύτη την κατάσταση και ενώ η αυτοοργάνωση και η αντι-εμπορευματοποίηση διεκδικούν όλο και περισσότερο χώρο, επιχειρήσαμε να συμβάλλουμε στη διάδοσή τους και στο διαδίκτυο, απαλλοτριώνοντας κάτι ακόμα που μας ανήκει και γίνεται αντικείμενο εκμετάλλευσης, τη μουσική. Έχουμε, επομένως, την ανάγκη να δημιουργήσουμε μια πλατφόρμα, με πρόταγμα το αντιεμπορικό και το αυτοοργανωμένο, η οποία θα διανέμει ελεύθερα τη μουσική χωρίς την άμεση (ποσοστά) ή έμμεση (διαφημίσεις) εκμετάλλευση είτε του ακροατού είτε του δημιουργού.
      </p>
      <p>
        Αρχικά, ως ακροατά, μας λείπει να ακούμε μουσική ανενόχλητα,χωρίς διακοπές για διαφημίσεις, χωρίς δεδομένα κινητής και χωρίς να γεμίζουμε ιούς τις συσκευές μας με downloads. Παράλληλα, χωρίς να “νοικιάζουμε” τραγούδια πληρώνοντας premium σε μεγαλοεταιρίες που συνεχίζουν να πλουτίζουν καπηλευόμενες αφενός ξένες δημιουργίες και αφετέρου την ανάγκη μας για μουσική. Δε θέλουμε να μας αναγκάζουν –έστω και καταλάθος– να ακούμε είτε κομμάτια με κακοποιητικό λόγο είτε άτομα με ανάλογες συμπεριφορές απλώς επειδή πατήσαμε “τυχαία αναπαραγωγή“.
      </p>
      <p>
        Από την άλλη, ως δημιουργά έχουμε την ανάγκη να διανέμουμε τη μουσική μας δωρεάν σε όλα, δίνοντας ακόμη το ελεύθερο για επανεπεξεργασία και αναδημοσίευση. Δε θέλουμε να πλουτίζει κανείς από τις δικές μας δημιουργίες. Δε θέλουμε κανένας αριθμός, κανένα “like” και κανένα “share” να καθορίζουν την επιτυχία της μουσικής μας.
      </p>
      <p>
        Για όλους αυτούς τους λόγους δημιουργούμε τη “ΛΑΤΕΡΝΑ”. Μία πλατφόρμα όπου θα μπορούν δημιουργά να ανεβάζουν μουσικές κι ακροατά να ακούν ανενόχταμπλ , με ή χωρίς σύνδεση στο διαδίκτυο.
      </p>
      <p>
        Όσο η μουσική εμπορευματοποιείται, τόσο θα ανοίγουμε τα παράθυρα μας να ακούμε τη λατέρνα!
      </p>
      <p>
        Η πλατφόρμα είναι ανοιχτή να στείλεις τις δικές σου δημιουργίες, επικοινωνώντας με mail στο: radio@1431am.org με θέμα “λατέρνα”.
      </p>
      <p>
        Αντι-ιεραρχικά, χωρίς σεξιστικό και κακοποιητικό περιεχόμενο, πάντα αντιεξουσιαστικά ε;;;
      </p>
      <hr>
    </div>
    <div class="border-top my-3"></div>
    <div class="text-center">
      <ExternalLink :href="url">
        GitHub <Icon icon="link" />
      </ExternalLink>
      <p>
        Licensed under the AGPLv3 license.
      </p>
      <ExternalLink :href="url_gizmo">
        Powered by gizmo_lab <Icon icon="link" />
      </ExternalLink>

      <div class="mt-4">
        <div>Server name: {{ auth.serverInfo?.name }}</div>
        <div>OpenSubsonic: {{ auth.serverInfo?.openSubsonic ?? false }}</div>
        <div v-if="auth.serverInfo?.openSubsonic">
          OpenSubsonic extensions: {{ auth.serverInfo?.extensions?.join(", ") }}
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <button class="btn btn-secondary" @click="$emit('close')">
        Close
      </button>
    </div>
  </b-modal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import Logo from './Logo.vue'
  import { useAuth } from '@/auth/service'

  export default defineComponent({
    components: {
      Logo,
    },
    props: {
      visible: { type: Boolean, required: true },
    },
    setup() {
      return {
        auth: useAuth()
      }
    },
    computed: {
      build: () => process.env.VUE_APP_BUILD,
      buildDate: () => process.env.VUE_APP_BUILD_DATE,
      url: () => 'https://github.com/g1zmolab/airsonic-refix-laterna',
      url_gizmo: () => 'https://gizmolab.net/'
    },
  })
</script>
