import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main extends Application {

    int count = 0; // click counter

    @Override
    public void start(Stage stage) {
        Label label = new Label("You clicked 0 times!");
        Button button = new Button("Click Me!");

        button.setOnAction(e -> {
            count++;
            label.setText("You clicked " + count + " times!");
        });

        VBox root = new VBox(20, label, button);
        root.setStyle("-fx-padding: 20; -fx-alignment: center;");

        Scene scene = new Scene(root, 300, 200);
        stage.setTitle("Click Counter App");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
