1<!-- 🎫 ~ file: helper_functions.ts:51 ~ jsonData=> {
      error:
      message: 'This model\'s maximum context length is 4097 tokens. However, your messages resulted in 4141 tokens. Please reduce the length of the messages.',
    --> > reason=> we are feeding all messages(with history) to chatgpt => solution => make new_messages with [instructions, last_prompt] and send it to chatcompletion > ❤🧡💛💛💚 SOLVED

2. <!-- nothing received as stream if wrong query passed
      -->

   > solution => made a counter, increment counter if any data found , else return "nothing found on database" onComplete function

3. <!-- response was showing all chunks together without any new line
      -->

   > solution => TEMP SOLUTION: added +"\n"+"\n" twice

4. <!-- response was showing brackets[object]
      -->
   > solution => made the object a string having key:value, key:value,...
