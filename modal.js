(function ($) {
    var $customModal = $('<div id="modal-select" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Select an Option</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
    $customModal.appendTo('body');
    var $modal = $('#modal-select');
    $.fn.mobileSelect = function (e) {
        $this = $(this);
        $this.each(function (i) {
            initialize($(this), i);
        });
    };
    $modal.on('show.bs.modal', function (e) {
        if(e.target.id === "modal-select"){
            $this_select_id = $(e.relatedTarget).data('id');
            $this_select = $('#'+$this_select_id);
            createSelectModal($this_select);
        }
    });
    $modal.on("click", ".mobileSelect li", function(){
        $this = $(this);
        $this_parent = $this.parent();
        $func = $this_parent.data('multiple') ? selectMultipleOptions : selectSingleOption;
        $func($(this));
    });    
    var initialize = function($this, $i) {
        $text = $this.find('option:selected').text();
        $this_id = $this.attr('id');
        if(!$this_id){
            $this_id = 'select-'+$i;
            $this.attr('id', $this_id);
        }
        $('button.'+$this_id+'').remove();
        $this.hide().before('<button type="button" class="btn btn-mobileSelect '+$this_id+'" data-id='+$this_id+' data-toggle="modal" data-target="#modal-select"><span class="text">'+$text+'</span>  <span class="caret"></span></button>');  
        setButtonText($this);
    };
    var createSelectModal = function($this){     
         $is_multiple = $this.is('[multiple]') ? true : false;
         $class = $is_multiple ? 'multiple' : 'single';
         $this_id = $this.attr('id');
         $select = "";
         $select += '<ul class="mobileSelect '+$class+'" data-multiple="'+$is_multiple+'">';
         $this.find('option[value!=""]').each(function (i) {
             $this_option = $(this);
             $this_text = $this_option.text();
             $this_val = $this_option.val();
             $selected = $this_option.is(':selected') ? 'selected' : '';
             $option_id = $this_id+'-option-'+i;
             $this_option.attr('id', $option_id);
             $select += '<li data-id='+$this_id+' data-val='+$this_val+' data-option-id='+$option_id+' class='+$selected+'> '+$this_text+'</li>';
         });
         $select += '</ul>';
         $('#modal-select .modal-body').html($select);        
    };
    
    var selectMultipleOptions = function($this){
        $select_id =  $this.data('id');
        $select_val = $this.data('val');
        $this_select =  $('#'+$select_id);
        $this_select_option_all = $this_select.find('option[value!=""]');
        $this_total_options = ($this_select_option_all.length);
        $this_parent = $this.parent();
        $this_all = $this_parent.find('li');
        
        $this.toggleClass('selected');
        if($select_val === 'all'){
            $toggleClass = $this.hasClass("selected") ? $this_all.addClass('selected') : $this_all.removeClass('selected'); 
        }
        
        $totSelected = $this.parent().find('li[data-val!="all"].selected').length;
        $is_all_selected = ($totSelected < $this_total_options - 1) ? true : false;
        
        if($is_all_selected){
            $this_parent.find('li[data-val="all"]').removeClass('selected');
        }else{
            $this_all.addClass('selected');
        }
        
        $this_parent.find('li').each(function () {
            $this_select_option =  $this_select.find('option[id='+$(this).data('option-id')+']');
            $this_select_option.prop("selected", $(this).hasClass("selected"));
        });
        setButtonText($this_select, true);
    };
    var selectSingleOption = function($this){
        $select_id =  $this.data('id');
        $select_option_id = $this.data('option-id');
        $this_select =  $('#'+$select_id);
        $this_select_option =  $this_select.find('option[id='+$select_option_id+']');
        $this.toggleClass('selected').siblings().removeClass('selected');
        $this_select_option.prop("selected", $this.hasClass("selected"));
        setButtonText($this_select, false);
        
        $modal.modal('hide');
        $this_select.trigger('change');
    };    
    
    var setButtonText = function($this){
        $is_multiple = $this.is('[multiple]') ? true : false;
        $select_id =  $this.attr('id');
        $this_button = $('button.'+$select_id);
        
        if($is_multiple){
            $totSelected = $this.find('option:selected[value!=""]option:selected[value!="all"]').length;
            $button_text = $totSelected ? $totSelected+' Selected' : $this.find('option:selected').text();
        }else{
            $button_text = $this.find('option:selected').text();
        }
        $this_button.html($button_text+ ' <span class="caret"></span>');
        $this.is(':disabled') ? $this_button.addClass('disabled') : $this_button.removeClass('disabled');
    };
    $('select').mobileSelect(); 
}( jQuery ));
