**Bower** `helios-preloader`

# Preloader

Simple but useful preloader library: add sets of files and set completion callbacks for sets and individual files.


## How to use

1. Create a set of files.

   ```
   preloader.add('catvid', 'videos/cat.webm', 'videos');
   preloader.add('dogvid', 'videos/dog.webm', 'videos');
   ```

2. Set a callback to run after your set is loaded.
	
	```
   preloader.whenReady( 'videos', function(set){
   	   console.log('Videos loaded!');
   })
   ```
3.  Set a callback to run after a specific file is loaded.

  	```
   preloader.whenReady({
       set: 'videos',
       file: 'dogvid',
       callback: function(){
	       console.log('HELLO THIS IS DOG');
       }
   });
   ```

4. Load your set.

   `preloader.start('videos')`

