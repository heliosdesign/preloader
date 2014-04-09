**Bower** `helios-preloader`

# Preloader

Simple but useful preloader library: add sets of files and set completion callbacks for sets and individual files.


## How to use

1. Create a set of files.

   ```
   // set, path, name
   preloader.add('videos', 'videos/cat.webm', 'cat');
   preloader.add('videos', 'videos/dog.webm', 'dog');
   ```

2. Set a callback to run after your set is loaded.
	
	```
   preloader.whenReady({
	   set: 'videos', 
	   callback: function(set){
	   	   console.log('Videos loaded!');
	   }
   })
   ```
3.  Set a callback to run after a specific file is loaded.

  	```
   preloader.whenReady({
       set: 'videos',
       file: 'dog',
       callback: function(){
	       console.log('HELLO THIS IS DOG');
       }
   });
   ```
   
4. Build a progress bar.

	```
	preloader.on('progress',function(progress){
		console.log( Math.round(100*progress.percent) + '% ' + progress.file );
	})
	
	```


5. Load your set.

   ```
   preloader.start('videos')`
   ```

