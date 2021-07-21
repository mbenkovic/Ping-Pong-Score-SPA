  <div class="ping_app">
    <section class="section">
      <img src="/ping-pong/public/Ping_Pong.jpg" class="ping">
      <p class="first_para"><b>Ping Pong Score Keeper</b></p>
    </section>
    <section class="section_grid">
      <div class="p1_section">
        <p>Select player one: </p>
        <select name="choice_p1" id="choice_p1" class="choice_select"></select>
      </div>
      <div class="score">
        <b><span id="first_score">0 </span><span>to </span><span id="second_score">0</span><span class="who"> </span></b>
      </div>
      <div class="p2_section">
        <p>Select player two: </p>
        <select name="choice_p2" id="choice_p2" class="choice_select"></select>
      </div>

      <div class="middle">
        <p class="second_para">Use the buttons below to keep score</p>
        <div class="select_play_to">
          <b>
            <p class="play_to">Playing To </p>
          </b>
          <select name="choice" class="choice">
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
            <option value="11">11</option>
          </select>
        </div>
      </div>
    </section>
    <section class="grid">
      <button class="button1">+1 Player One</button>
      <button class="button2">+1 Player Two</button>
    </section>
    <section class="grid">
      <button class="button3">-1 Player One</button>
      <button class="button4">-1 Player Two</button>
    </section>
    <section class="section">
      <button class="button5">Reset</button>
    </section>
  </div>
  <script src = "/ppsingle/js/score_tracker.js"></script>